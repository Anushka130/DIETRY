const mongoose = require("mongoose");

const foodDiarySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
    mealType: {
        type: String,
        enum: ["Breakfast", "Lunch", "Dinner", "Snacks"],
        required: true
    },
    date: { type: String, required: true } 
});

const FoodDiary = mongoose.model("FoodDiary", foodDiarySchema);

module.exports = FoodDiary;