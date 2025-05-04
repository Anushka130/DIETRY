const WorkoutPlan = require("../models/workoutPlanModel")

// Create a new workout plan
exports.createWorkoutPlan = async (req, res) => {
  try {
    const workoutPlan = new WorkoutPlan({ ...req.body, userId: req.user.id })
    await workoutPlan.save()
    res.status(201).json(workoutPlan)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Get all workout plans for the logged-in user
exports.getWorkoutPlans = async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ userId: req.user.id })
    res.status(200).json(plans)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get a single workout plan by ID
exports.getWorkoutPlanById = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ _id: req.params.id, userId: req.user.id })
    if (!plan) return res.status(404).json({ message: "Workout plan not found" })
    res.status(200).json(plan)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update a workout plan
exports.updateWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, {
      new: true,
    })
    if (!plan) return res.status(404).json({ message: "Workout plan not found" })
    res.status(200).json(plan)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Delete a workout plan
exports.deleteWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!plan) return res.status(404).json({ message: "Workout plan not found" })
    res.status(200).json({ message: "Workout plan deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
