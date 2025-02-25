const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: false },
    carbs: { type: Number, required: false },
    fats: { type: Number, required: false }
});

const foodModel = mongoose.model("Food", foodSchema);

module.exports = foodModel;


