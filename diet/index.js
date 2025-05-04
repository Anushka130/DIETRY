const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cors = require("cors")
require("dotenv").config()

const userModel = require("./models/userModel")
const verifyToken = require("./auth/verifyToken")
const foodRoutes = require("./routes/food")
const workoutRoutes = require("./routes/workoutRoutes")
const workoutSessionRoutes = require("./routes/workoutSessionRoutes")
const activityRoutes = require("./routes/activityRoutes")
const reportRoutes = require("./routes/reportRoutes")
const PORT = process.env.PORT || 5000

mongoose
  .connect("mongodb://127.0.0.1:27017/diet")
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err))

const app = express()
app.use(express.json())
app.use(cors())
app.use("/api/workouts", workoutRoutes)
app.use("/api/workout-sessions", workoutSessionRoutes)
app.use("/api/activities", activityRoutes)
app.use("/api/reports", reportRoutes)
console.log("Workout session routes mounted!")
app.use("/food", foodRoutes)

/**
 * @route POST /register
 * @desc Register a new user
 */
app.post("/register", async (req, res) => {
  try {
    const user = req.body
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    user.hasAllergyInfo = false // Ensure allergy step is false by default
    await userModel.create(user)
    res.status(201).send({ message: "User Registered" })
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: "Error occurred during registration" })
  }
})

/**
 * @route POST /login
 * @desc User login
 */
app.post("/login", async (req, res) => {
  try {
    const userCred = req.body
    const user = await userModel.findOne({ email: userCred.email })

    if (!user) {
      return res.status(404).send({ message: "User not registered" })
    }

    const isMatch = await bcrypt.compare(userCred.password, user.password)
    if (!isMatch) {
      return res.status(403).send({ message: "Incorrect Password" })
    }

    jwt.sign({ id: user._id, email: user.email }, "diet", { expiresIn: "1h" }, async (err, token) => {
      if (err) {
        return res.status(500).send({ message: "Error generating token" })
      }

      const userData = {
        id: user._id, // Include user ID for workout plan operations
        name: user.name,
        email: user.email,
        age: user.age,
        height: user.height,
        weight: user.weight,
        gender: user.gender,
        activityLevel: user.activityLevel,
        goal: user.goal,
        allergy: user.allergy,
        hasDetails: user.hasDetails, // Virtual field
        hasAllergyInfo: user.hasAllergyInfo, // Allergy selection status
      }

      res.send({ message: "Login Success", token, ...userData })
    })
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: "Server error" })
  }
})

/**
 * @route POST /user-details
 * @desc Update user details after login
 */
app.post("/user-details", verifyToken, async (req, res) => {
  try {
    const { height, weight, gender, activityLevel, goal } = req.body
    const email = req.user.email

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { height, weight, gender, activityLevel, goal },
      { new: true },
    )

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" })
    }

    res.status(200).send({
      message: "User details updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        age: updatedUser.age,
        height: updatedUser.height,
        weight: updatedUser.weight,
        gender: updatedUser.gender,
        activityLevel: updatedUser.activityLevel,
        goal: updatedUser.goal,
        hasDetails: updatedUser.hasDetails,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: "Error updating user details" })
  }
})

/**
 * @route POST /update-allergy
 * @desc Update allergy information (optional step)
 */
app.post("/update-allergy", verifyToken, async (req, res) => {
  try {
    const { allergy } = req.body
    const email = req.user.email

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { allergy, hasAllergyInfo: true }, // Mark allergy step as completed
      { new: true },
    )

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" })
    }

    res.status(200).send({
      message: "Allergy information updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        allergy: updatedUser.allergy,
        hasAllergyInfo: updatedUser.hasAllergyInfo,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: "Error updating allergy information" })
  }
})

/**
 * @route GET /user/:id
 * @desc Get user details by ID
 */
app.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id

    // Optional: Check if the ID in token matches the requested ID
    if (req.user.id !== userId) {
      return res.status(403).send({ message: "Unauthorized access" })
    }

    const user = await userModel.findById(userId).select("-password") // exclude password

    if (!user) {
      return res.status(404).send({ message: "User not found" })
    }

    res.status(200).send(user)
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: "Error fetching user details" })
  }
})

/**
 * @route GET /me
 * @desc Fetch authenticated user info
 */
app.get("/me", verifyToken, async (req, res) => {
  try {
    const email = req.user.email
    const user = await userModel.findOne({ email })

    if (!user) return res.status(404).send({ message: "User not found" })

    res.status(200).send(user)
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: "Error fetching user info" })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
