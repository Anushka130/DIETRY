const Activity = require("../models/activityModel")
const User = require("../models/userModel") // Import the User model

exports.createActivity = async (req, res) => {
  try {
    const { activity, duration, calories } = req.body

    // Get user weight for more accurate calorie calculation if calories not provided
    let calculatedCalories = calories

    if (!calculatedCalories) {
      const user = await User.findById(req.user.id)
      const userWeight = user?.weight || 70

      // Default MET values for common activities
      let MET = 5 // Default moderate activity

      // Adjust MET based on activity type
      const activityLower = activity.toLowerCase()
      if (activityLower.includes("run") || activityLower.includes("sprint")) {
        MET = 8 // Running/sprinting
      } else if (activityLower.includes("walk")) {
        MET = 3.5 // Walking
      } else if (activityLower.includes("cycle") || activityLower.includes("bike")) {
        MET = 6 // Cycling
      } else if (activityLower.includes("swim")) {
        MET = 7 // Swimming
      } else if (activityLower.includes("yoga")) {
        MET = 3 // Yoga
      } else if (activityLower.includes("weight") || activityLower.includes("strength")) {
        MET = 5 // Weight/strength training
      }

      // Calculate calories: MET * weight (kg) * duration (hours)
      const durationHours = duration / 60
      calculatedCalories = Math.round(MET * userWeight * durationHours)
    }

    const newActivity = new Activity({
      userId: req.user.id,
      activity,
      duration,
      calories: calculatedCalories,
    })

    await newActivity.save()
    res.status(201).json(newActivity)
  } catch (error) {
    console.error("Error creating activity:", error)
    res.status(500).json({ message: "Failed to create activity" })
  }
}

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.id }).sort({ date: -1 })
    res.status(200).json(activities)
  } catch (error) {
    console.error("Error fetching activities:", error)
    res.status(500).json({ message: "Failed to fetch activities" })
  }
}
