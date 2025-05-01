const WorkoutSession = require("../models/workoutSessionModel");
const User = require("../models/userModel");

exports.createWorkoutSession = async (req, res) => {
  try {
    const { planId, planName, completedExercises, duration } = req.body;

    const user = await User.findById(req.user.id);
    const userWeight = user?.weight || 70;

    const durationMinutes = duration || 45;
    const durationHours = durationMinutes / 60;
    const MET = 6;

    const caloriesBurned = Math.round(MET * userWeight * durationHours);

    const session = new WorkoutSession({
      userId: req.user.id,
      planId,
      planName,
      completedExercises,
      duration: durationMinutes,
      caloriesBurned,
      completedAt: new Date(),
    });

    await session.save();

    res.status(201).json(session);
  } catch (error) {
    console.error("Error creating workout session:", error);
    res.status(500).json({ message: "Failed to create workout session." });
  }
};

exports.getWorkoutSessions = async (req, res) => {
  try {
    const sessions = await WorkoutSession.find({ userId: req.user.id }).sort({ completedAt: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching workout sessions:", error);
    res.status(500).json({ message: "Failed to fetch workout sessions." });
  }
};
