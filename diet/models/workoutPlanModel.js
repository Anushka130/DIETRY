const mongoose = require("mongoose")

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: String, required: true },
  weight: { type: String, required: true },
})

const workoutHistorySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  completedExercises: [String],
  notes: { type: String },
})

const workoutPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ["Strength", "Cardio", "Hypertrophy", "Flexibility", "Endurance"],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Advanced"],
  },
  duration: { type: String, required: true },
  frequency: { type: String, required: true },
  progress: { type: Number, default: 0 },
  exercises: [exerciseSchema],
  history: [workoutHistorySchema],
  notes: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Update the updatedAt field on save
workoutPlanSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema)
module.exports = WorkoutPlan
