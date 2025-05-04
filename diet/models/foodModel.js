const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number },
    carbs: { type: Number },
    fats: { type: Number },
    category: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snacks"],
      required: true
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // changed to ObjectId
  });

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;