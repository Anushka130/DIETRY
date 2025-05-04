const express = require("express")
const router = express.Router()
const verifyToken = require("../auth/verifyToken")
const DiaryEntry = require("../models/diaryModel")
const WorkoutSession = require("../models/workoutSessionModel")
const Activity = require("../models/activityModel")

// Helper function to get date range
const getDateRange = (startDate, endDate) => {
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)

  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

// Get weekly report data
router.get("/weekly", verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const userId = req.user.id

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" })
    }

    const { start, end } = getDateRange(startDate, endDate)

    // Fetch food diary entries for the date range
    const foodEntries = await DiaryEntry.find({
      userId,
      date: { $gte: start, $lte: end },
    }).populate("food")

    // Fetch workout sessions for the date range
    const workoutSessions = await WorkoutSession.find({
      userId,
      completedAt: { $gte: start, $lte: end },
    })

    // Fetch activities for the date range
    const activities = await Activity.find({
      userId,
      date: { $gte: start, $lte: end },
    })

    // Process food data
    const foodData = {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      mealBreakdown: {
        Breakfast: { calories: 0, protein: 0, carbs: 0, fats: 0, count: 0 },
        Lunch: { calories: 0, protein: 0, carbs: 0, fats: 0, count: 0 },
        Dinner: { calories: 0, protein: 0, carbs: 0, fats: 0, count: 0 },
        Snacks: { calories: 0, protein: 0, carbs: 0, fats: 0, count: 0 },
      },
      dailyIntake: {},
    }

    foodEntries.forEach((entry) => {
      if (entry.food) {
        const calories = entry.food.calories * entry.quantity
        const protein = (entry.food.protein || 0) * entry.quantity
        const carbs = (entry.food.carbs || 0) * entry.quantity
        const fats = (entry.food.fats || 0) * entry.quantity

        // Add to totals
        foodData.totalCalories += calories
        foodData.totalProtein += protein
        foodData.totalCarbs += carbs
        foodData.totalFats += fats

        // Add to meal breakdown
        if (foodData.mealBreakdown[entry.category]) {
          foodData.mealBreakdown[entry.category].calories += calories
          foodData.mealBreakdown[entry.category].protein += protein
          foodData.mealBreakdown[entry.category].carbs += carbs
          foodData.mealBreakdown[entry.category].fats += fats
          foodData.mealBreakdown[entry.category].count += 1
        }

        // Add to daily intake
        const dateStr = entry.date.toISOString().split("T")[0]
        if (!foodData.dailyIntake[dateStr]) {
          foodData.dailyIntake[dateStr] = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
          }
        }

        foodData.dailyIntake[dateStr].calories += calories
        foodData.dailyIntake[dateStr].protein += protein
        foodData.dailyIntake[dateStr].carbs += carbs
        foodData.dailyIntake[dateStr].fats += fats
      }
    })

    // Process workout data
    const workoutData = {
      totalSessions: workoutSessions.length,
      totalDuration: workoutSessions.reduce((sum, session) => sum + (session.duration || 0), 0),
      totalCaloriesBurned: workoutSessions.reduce((sum, session) => sum + (session.caloriesBurned || 0), 0),
      workoutsByCategory: {},
      dailyWorkouts: {},
    }

    workoutSessions.forEach((session) => {
      // Group by category if available
      if (session.planName) {
        let category = "Other"

        if (session.planName.toLowerCase().includes("strength")) {
          category = "Strength"
        } else if (session.planName.toLowerCase().includes("cardio")) {
          category = "Cardio"
        } else if (session.planName.toLowerCase().includes("hypertrophy")) {
          category = "Hypertrophy"
        }

        if (!workoutData.workoutsByCategory[category]) {
          workoutData.workoutsByCategory[category] = {
            count: 0,
            duration: 0,
            caloriesBurned: 0,
          }
        }

        workoutData.workoutsByCategory[category].count += 1
        workoutData.workoutsByCategory[category].duration += session.duration || 0
        workoutData.workoutsByCategory[category].caloriesBurned += session.caloriesBurned || 0
      }

      // Add to daily workouts
      const dateStr = new Date(session.completedAt).toISOString().split("T")[0]
      if (!workoutData.dailyWorkouts[dateStr]) {
        workoutData.dailyWorkouts[dateStr] = {
          count: 0,
          duration: 0,
          caloriesBurned: 0,
        }
      }

      workoutData.dailyWorkouts[dateStr].count += 1
      workoutData.dailyWorkouts[dateStr].duration += session.duration || 0
      workoutData.dailyWorkouts[dateStr].caloriesBurned += session.caloriesBurned || 0
    })

    // Process activity data
    const activityData = {
      totalActivities: activities.length,
      totalDuration: activities.reduce((sum, activity) => sum + (activity.duration || 0), 0),
      totalCaloriesBurned: activities.reduce((sum, activity) => sum + (activity.calories || 0), 0),
      activitiesByType: {},
      dailyActivities: {},
    }

    activities.forEach((activity) => {
      // Group by activity type
      if (!activityData.activitiesByType[activity.activity]) {
        activityData.activitiesByType[activity.activity] = {
          count: 0,
          duration: 0,
          caloriesBurned: 0,
        }
      }

      activityData.activitiesByType[activity.activity].count += 1
      activityData.activitiesByType[activity.activity].duration += activity.duration || 0
      activityData.activitiesByType[activity.activity].caloriesBurned += activity.calories || 0

      // Add to daily activities
      const dateStr = new Date(activity.date).toISOString().split("T")[0]
      if (!activityData.dailyActivities[dateStr]) {
        activityData.dailyActivities[dateStr] = {
          count: 0,
          duration: 0,
          caloriesBurned: 0,
        }
      }

      activityData.dailyActivities[dateStr].count += 1
      activityData.dailyActivities[dateStr].duration += activity.duration || 0
      activityData.dailyActivities[dateStr].caloriesBurned += activity.calories || 0
    })

    // Calculate combined calories (consumed vs. burned)
    const caloriesSummary = {
      consumed: foodData.totalCalories,
      burned: workoutData.totalCaloriesBurned + activityData.totalCaloriesBurned,
      net: foodData.totalCalories - (workoutData.totalCaloriesBurned + activityData.totalCaloriesBurned),
    }

    // Generate daily summary for the entire period
    const dailySummary = {}
    const dateRange = []

    // Create array of dates in the range
    const currentDate = new Date(start)
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split("T")[0]
      dateRange.push(dateStr)

      dailySummary[dateStr] = {
        caloriesConsumed: foodData.dailyIntake[dateStr]?.calories || 0,
        caloriesBurned:
          (workoutData.dailyWorkouts[dateStr]?.caloriesBurned || 0) +
          (activityData.dailyActivities[dateStr]?.caloriesBurned || 0),
        netCalories:
          (foodData.dailyIntake[dateStr]?.calories || 0) -
          ((workoutData.dailyWorkouts[dateStr]?.caloriesBurned || 0) +
            (activityData.dailyActivities[dateStr]?.caloriesBurned || 0)),
        protein: foodData.dailyIntake[dateStr]?.protein || 0,
        carbs: foodData.dailyIntake[dateStr]?.carbs || 0,
        fats: foodData.dailyIntake[dateStr]?.fats || 0,
        workouts: workoutData.dailyWorkouts[dateStr]?.count || 0,
        activities: activityData.dailyActivities[dateStr]?.count || 0,
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Prepare response
    const reportData = {
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
        days: dateRange,
      },
      summary: {
        caloriesSummary,
        foodSummary: {
          totalCalories: foodData.totalCalories,
          totalProtein: foodData.totalProtein,
          totalCarbs: foodData.totalCarbs,
          totalFats: foodData.totalFats,
          averageCalories: dateRange.length > 0 ? Math.round(foodData.totalCalories / dateRange.length) : 0,
          mealBreakdown: foodData.mealBreakdown,
        },
        exerciseSummary: {
          totalWorkouts: workoutData.totalSessions,
          totalActivities: activityData.totalActivities,
          totalDuration: workoutData.totalDuration + activityData.totalDuration,
          totalCaloriesBurned: workoutData.totalCaloriesBurned + activityData.totalCaloriesBurned,
        },
      },
      details: {
        dailySummary,
        workoutsByCategory: workoutData.workoutsByCategory,
        activitiesByType: activityData.activitiesByType,
      },
    }

    res.status(200).json(reportData)
  } catch (error) {
    console.error("Error generating weekly report:", error)
    res.status(500).json({ message: "Failed to generate weekly report" })
  }
})

module.exports = router
