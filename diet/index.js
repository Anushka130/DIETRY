const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const userModel = require("./models/userModel");
const verifyToken = require("./auth/verifyToken");
const foodRoutes = require("./routes/food");

const PORT = process.env.PORT || 3000;

mongoose
  .connect("mongodb://127.0.0.1:27017/diet")
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));

const app = express();
app.use(express.json());
app.use(cors());
app.use("/food", foodRoutes);

app.post("/register", async (req, res) => {
  try {
    let user = req.body;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.hasAllergyInfo = false;
    await userModel.create(user);
    res.status(201).send({ message: "User Registered" });
  } catch (err) {
    res.status(500).send({ message: "Error occurred during registration" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const userCred = req.body;
    const user = await userModel.findOne({ email: userCred.email });

    if (!user) return res.status(404).send({ message: "User not registered" });

    const isMatch = await bcrypt.compare(userCred.password, user.password);
    if (!isMatch) return res.status(403).send({ message: "Incorrect Password" });
    jwt.sign({ email: user.email, userId: user._id }, "diet", { expiresIn: "1h" },
      async (err, token) => {
      if (err) return res.status(500).send({ message: "Error generating token" });

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
        hasDetails: user.hasDetails,
        hasAllergyInfo: user.hasAllergyInfo,
      };

      res.send({ message: "Login Success", token, ...userData });
    });
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/user-details", verifyToken, async (req, res) => {
  try {
    const { height, weight, gender, activityLevel, goal } = req.body;
    const email = req.user.email;

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { height, weight, gender, activityLevel, goal },
      { new: true }
    );

    if (!updatedUser) return res.status(404).send({ message: "User not found" });

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
    res.status(500).send({ message: "Error updating user details" });
  }
});

app.post("/update-allergy", verifyToken, async (req, res) => {
  try {
    const { allergy } = req.body;
    const email = req.user.email;

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { allergy, hasAllergyInfo: true },
      { new: true }
    );

    if (!updatedUser) return res.status(404).send({ message: "User not found" });

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
    res.status(500).send({ message: "Error updating allergy information" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
