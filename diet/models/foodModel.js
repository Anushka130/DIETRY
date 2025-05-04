const mongoose = require("mongoose")

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number },
  carbs: { type: Number },
  fats: { type: Number },
  category: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner", "Snacks"],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Changed from required: true to make it optional
  },
  isGlobal: {
    type: Boolean,
    default: true, // New field to indicate if food is globally accessible
  },
})

// Add index for faster searches
foodSchema.index({ name: "text" })

const Food = mongoose.model("Food", foodSchema)

module.exports = Food
