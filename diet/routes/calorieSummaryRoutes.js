const express = require("express")
const router = express.Router()
const { getDailySummary, getDateRangeSummary } = require("../controllers/calorieSummaryController")
const verifyToken = require("../auth/verifyToken")
const User = require("../models/userModel")

// Get calorie summary for a specific date
router.get("/daily/:date", verifyToken, getDailySummary)

// Get calorie summary for a date range
router.get("/range", verifyToken, getDateRangeSummary)

// Add a new route for getting user's weekly goals
router.get("/weekly-goals", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id

    // Get user data to calculate personalized goals
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Calculate personalized goals based on user data
    let weeklyCalorieGoal = 2000 * 7 // Default
    let weeklyCalorieBurnGoal = 3500 // Default (approximately 1lb of weight loss)
    const weeklyExerciseGoal = 7 // Default to 1 activity per day

    // If user has complete profile data, calculate more personalized goals
    if (user.height && user.weight && user.gender && user.activityLevel && user.goal) {
      // Base metabolic rate calculation (BMR) using Harris-Benedict equation
      let bmr = 0
      if (user.gender === "male") {
        bmr = 88.362 + 13.397 * user.weight + 4.799 * user.height - 5.677 * user.age
      } else {
        bmr = 447.593 + 9.247 * user.weight + 3.098 * user.height - 4.33 * user.age
      }

      // Activity multiplier
      let activityMultiplier = 1.2 // Default: sedentary
      if (user.activityLevel === "light") activityMultiplier = 1.375
      if (user.activityLevel === "moderate") activityMultiplier = 1.55
      if (user.activityLevel === "active") activityMultiplier = 1.725

      // Total Daily Energy Expenditure (TDEE)
      const tdee = bmr * activityMultiplier

      // Adjust based on goal
      if (user.goal === "lose_weight") {
        weeklyCalorieGoal = Math.round((tdee - 500) * 7) // Deficit for weight loss
        weeklyCalorieBurnGoal = 3500 // Target 1lb per week
      } else if (user.goal === "gain_muscle") {
        weeklyCalorieGoal = Math.round((tdee + 300) * 7) // Surplus for muscle gain
        weeklyCalorieBurnGoal = 2000 // Lower burn goal for muscle gain
      } else {
        weeklyCalorieGoal = Math.round(tdee * 7) // Maintenance
        weeklyCalorieBurnGoal = 2500 // Moderate burn goal
      }
    }

    res.status(200).json({
      weeklyCalorieGoal,
      weeklyExerciseGoal,
      weeklyCalorieBurnGoal,
    })
  } catch (error) {
    console.error("Error getting weekly goals:", error)
    res.status(500).json({ message: "Failed to get weekly goals" })
  }
})

module.exports = router
