const mongoose = require("mongoose");

const workoutSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutPlan",
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    completedExercises: [
      {
        name: String,
        sets: Number,
        reps: String,
        weight: String,
      },
    ],
    caloriesBurned: {
      type: Number,
      default: 0, // Important fallback for old sessions
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const WorkoutSession = mongoose.model("WorkoutSession", workoutSessionSchema);
module.exports = WorkoutSession;
