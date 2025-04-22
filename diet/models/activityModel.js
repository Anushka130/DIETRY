const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  activity: { type: String, required: true },
  duration: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
