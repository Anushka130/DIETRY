const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const userModel = require("./models/userModel");
const foodModel = require("./models/foodModel");
const verifyToken = require("./models/verifyToken"); // Keep token verification

const PORT = process.env.PORT || 3000;

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

app.get("/foods/:name", async (req, res) => {
  console.log("search called")
  try {
    const allFoods = await foodModel.find({});
    const searchTerm = req.params.name.toLowerCase();

    function fuzzyMatch(food, search) {
      const foodName = food.name.toLowerCase();
      if (foodName === search) return 1;
      if (foodName.includes(search)) return 0.8;

      let searchIndex = 0;
      for (let i = 0; i < foodName.length && searchIndex < search.length; i++) {
        if (foodName[i] === search[searchIndex]) {
          searchIndex++;
        }
      }
      if (searchIndex === search.length) return 0.6;

      let matchCount = 0;
      for (let i = 0; i < search.length; i++) {
        if (foodName.includes(search[i])) {
          matchCount++;
        }
      }

      const matchRatio = matchCount / search.length;
      if (matchRatio >= 0.5) return matchRatio * 0.5;

      return 0;
    }

    const results = allFoods
      .map(food => ({
        food,
        score: fuzzyMatch(food, searchTerm)
      }))
      .filter(item => item.score > 0.2)
      .sort((a, b) => b.score - a.score)
      .map(item => item.food);

    if (results.length !== 0) {
      res.send(results);
    } else {
      res.status(404).send({ message: "Food Item Not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Some Problem in getting the food" });
  }
});

app.post("/add-food", async (req, res) => {
  console.log("addd called")
  try {
    const { name, calories, protein, carbs, fats, category, userId } = req.body;

    if (!name || !calories || !category || !userId) {
      return res.status(400).send({ message: "Name, calories, category, and userId are required fields" });
    }

    const validCategories = ["Breakfast", "Lunch", "Dinner", "Snacks"];
    if (!validCategories.includes(category)) {
      return res.status(400).send({ message: "Invalid category. Must be one of: Breakfast, Lunch, Dinner, Snacks" });
    }

    const existingFood = await foodModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') }, userId });
    if (existingFood) {
      return res.status(409).send({ message: "Food item with this name already exists for this user" });
    }

    const newFood = new Food({
      name,
      calories,
      protein: protein || 0,
      carbs: carbs || 0,
      fats: fats || 0,
      category,
      userId
    });

    const savedFood = await newFood.save();

    res.status(201).send({
      message: "Food item added successfully",
      food: savedFood
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error adding food item" });
  }
});

app.post("/food-diary", async (req, res) => {
  console.log("added food")
  try {
    const { userId, name, calories, protein, carbs, fats, category } = req.body;

    // Check required fields
    if (!userId || !name || !calories || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const validCategories = ["Breakfast", "Lunch", "Dinner", "Snacks"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const newDiaryEntry = new foodModel({
      userId,
      name,
      calories,
      protein: protein || 0,
      carbs: carbs || 0,
      fats: fats || 0,
      category
    });

    const savedEntry = await newDiaryEntry.save();

    res.status(201).json({
      message: "Food diary entry saved successfully ✅",
      entry: savedEntry
    });
  } catch (err) {
    console.error("Error saving food entry:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/food-diary", async (req, res) => {
  console.log("GET /food-diary called");
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId in query" });
    }

    const entries = await foodModel.find({ userId });

    if (!entries.length) {
      return res.status(404).json({ message: "No entries found for this user" });
    }

    res.json(entries);
  } catch (err) {
    console.error("Error fetching food diary:", err);
    res.status(500).json({ message: "Failed to fetch food diary" });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});