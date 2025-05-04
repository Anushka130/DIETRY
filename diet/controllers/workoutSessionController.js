const WorkoutSession = require("../models/workoutSessionModel")
const User = require("../models/userModel")

exports.createWorkoutSession = async (req, res) => {
  try {
    const { planId, planName, completedExercises, duration } = req.body

    const user = await User.findById(req.user.id)
    const userWeight = user?.weight || 70

    // Calculate duration in hours (default to 45 minutes if not provided)
    const durationMinutes = duration || 45
    const durationHours = durationMinutes / 60

    // MET value varies by workout intensity - using a default of 6 (moderate intensity)
    // For more accuracy, we could determine MET based on workout category
    let MET = 6

    // Adjust MET based on workout name/type if available
    if (planName) {
      const planNameLower = planName.toLowerCase()
      if (planNameLower.includes("cardio") || planNameLower.includes("running")) {
        MET = 8 // Higher intensity for cardio
      } else if (planNameLower.includes("strength")) {
        MET = 6 // Moderate intensity for strength training
      } else if (planNameLower.includes("yoga") || planNameLower.includes("flexibility")) {
        MET = 4 // Lower intensity for yoga/flexibility
      }
    }

    // Calculate calories burned using the formula: MET * weight (kg) * duration (hours)
    const caloriesBurned = Math.round(MET * userWeight * durationHours)

    const session = new WorkoutSession({
      userId: req.user.id,
      planId,
      planName,
      completedExercises,
      duration: durationMinutes,
      caloriesBurned,
      completedAt: new Date(),
    })

    await session.save()

    res.status(201).json(session)
  } catch (error) {
    console.error("Error creating workout session:", error)
    res.status(500).json({ message: "Failed to create workout session." })
  }
}

exports.getWorkoutSessions = async (req, res) => {
  try {
    const sessions = await WorkoutSession.find({ userId: req.user.id }).sort({ completedAt: -1 })
    res.status(200).json(sessions)
  } catch (error) {
    console.error("Error fetching workout sessions:", error)
    res.status(500).json({ message: "Failed to fetch workout sessions." })
  }
}
