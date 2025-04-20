const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const userModel = require("./models/userModel");
const foodModel = require("./models/foodModel");
const verifyToken = require("./models/verifyToken"); // Keep token verification

const PORT = process.env.PORT || 5000;

mongoose
  .connect("mongodb://127.0.0.1:27017/diet")
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));

const app = express();
app.use(express.json());
app.use(cors());

/**
 * @route POST /register
 * @desc Register a new user
 */
app.post("/register", async (req, res) => {
  try {
    let user = req.body;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.hasAllergyInfo = false; // Ensure allergy step is false by default
    await userModel.create(user);
    res.status(201).send({ message: "User Registered" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error occurred during registration" });
  }
});

/**
 * @route POST /login
 * @desc User login
 */
app.post("/login", async (req, res) => {
  try {
    const userCred = req.body;
    const user = await userModel.findOne({ email: userCred.email });

    if (!user) {
      return res.status(404).send({ message: "User not registered" });
    }

    const isMatch = await bcrypt.compare(userCred.password, user.password);
    if (!isMatch) {
      return res.status(403).send({ message: "Incorrect Password" });
    }

    jwt.sign(
      { email: user.email },
      "diet",
      { expiresIn: "1h" },
      async (err, token) => {
        if (err) {
          return res.status(500).send({ message: "Error generating token" });
        }

        const userData = {
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
        };

        res.send({ message: "Login Success", token, ...userData });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

/**
 * @route GET /foods
 * @desc Get all food items (protected route)
 */
app.get("/foods",  async (req, res) => {
  try {
    let foods = await foodModel.find();
    res.send(foods);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Could not fetch food items" });
  }
});

/**
 * @route POST /user-details
 * @desc Update user details after login
 */
app.post("/user-details", verifyToken, async (req, res) => {
  try {
    const { height, weight, gender, activityLevel, goal } = req.body;
    const email = req.user.email;

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { height, weight, gender, activityLevel, goal },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({
      message: "User details updated successfully",
      user: {
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
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error updating user details" });
  }
});

/**
 * @route POST /update-allergy
 * @desc Update allergy information (optional step)
 */
app.post("/update-allergy", verifyToken, async (req, res) => {
  try {
    const { allergy } = req.body;
    const email = req.user.email;

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { allergy, hasAllergyInfo: true }, // Mark allergy step as completed
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({
      message: "Allergy information updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        allergy: updatedUser.allergy,
        hasAllergyInfo: updatedUser.hasAllergyInfo,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error updating allergy information" });
  }
});

  //endpoint to search food by name
   
  app.get("/foods/:name",async(req,res)=>{

    try{
     let foods = await foodModel.find({name:{$regex:req.params.name,$options:'i'}})
     if(foods.length!==0)
     {
      res.send(foods);
     }else{
      res.status(404).send({message:"Food Item Not Found"})
     }
    }
    catch(err){
      console.log(err);
      res.status(500).send({message:"Some Problem in getting the food"})
    }

  })






app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
