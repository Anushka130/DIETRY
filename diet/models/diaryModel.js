const mongoose = require("mongoose");

const diaryEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
  date: { type: Date, required: true },
  category: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner", "Snacks"],
    required: true
  },
  quantity: { type: Number, default: 1 }
});

diaryEntrySchema.index({ userId: 1, date: 1 });

const DiaryEntry = mongoose.model("DiaryEntry", diaryEntrySchema);
module.exports = DiaryEntry;