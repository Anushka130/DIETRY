const WorkoutSession = require("../models/workoutSessionModel")
const Activity = require("../models/activityModel")
const DiaryEntry = require("../models/diaryModel")
const Food = require("../models/foodModel")

// Get calorie summary for a specific date
exports.getDailySummary = async (req, res) => {
  try {
    const { date } = req.params
    const userId = req.user.id

    // Parse the date and create start/end timestamps for the day
    const targetDate = new Date(date)
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))

    // Get workout sessions for the day
    const workoutSessions = await WorkoutSession.find({
      userId,
      completedAt: { $gte: startOfDay, $lte: endOfDay },
    })

    // Get activities for the day
    const activities = await Activity.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    })

    // Get food entries for the day
    const foodEntries = await DiaryEntry.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("food")

    // Calculate calories
    const workoutCalories = workoutSessions.reduce((total, session) => total + (session.caloriesBurned || 0), 0)
    const activityCalories = activities.reduce((total, activity) => total + (activity.calories || 0), 0)
    const foodCalories = foodEntries.reduce((total, entry) => {
      return total + (entry.food?.calories || 0) * (entry.quantity || 1)
    }, 0)

    // Calculate macros
    const macros = foodEntries.reduce(
      (total, entry) => {
        const food = entry.food || {}
        const quantity = entry.quantity || 1
        return {
          protein: total.protein + (food.protein || 0) * quantity,
          carbs: total.carbs + (food.carbs || 0) * quantity,
          fats: total.fats + (food.fats || 0) * quantity,
        }
      },
      { protein: 0, carbs: 0, fats: 0 },
    )

    // Prepare response
    const summary = {
      date,
      caloriesConsumed: foodCalories,
      caloriesBurned: workoutCalories + activityCalories,
      workoutCalories,
      activityCalories,
      netCalories: foodCalories - (workoutCalories + activityCalories),
      macros,
    }

    res.status(200).json(summary)
  } catch (error) {
    console.error("Error getting calorie summary:", error)
    res.status(500).json({ message: "Failed to get calorie summary" })
  }
}

// Get calorie summary for a date range (e.g., week)
exports.getDateRangeSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const userId = req.user.id

    // Parse dates
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)

    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    // Get workout sessions for the date range
    const workoutSessions = await WorkoutSession.find({
      userId,
      completedAt: { $gte: start, $lte: end },
    })

    // Get activities for the date range
    const activities = await Activity.find({
      userId,
      date: { $gte: start, $lte: end },
    })

    // Get food entries for the date range
    const foodEntries = await DiaryEntry.find({
      userId,
      date: { $gte: start, $lte: end },
    }).populate("food")

    // Calculate daily summaries
    const dailySummaries = {}

    // Initialize days in range
    const days = getDaysInRange(start, end)
    days.forEach((day) => {
      const dateString = day.toISOString().split("T")[0]
      dailySummaries[dateString] = {
        date: dateString,
        caloriesConsumed: 0,
        caloriesBurned: 0,
        workoutCalories: 0,
        activityCalories: 0,
        netCalories: 0,
        macros: { protein: 0, carbs: 0, fats: 0 },
      }
    })

    // Process workout sessions
    workoutSessions.forEach((session) => {
      const dateString = new Date(session.completedAt).toISOString().split("T")[0]
      if (dailySummaries[dateString]) {
        dailySummaries[dateString].workoutCalories += session.caloriesBurned || 0
        dailySummaries[dateString].caloriesBurned += session.caloriesBurned || 0
        dailySummaries[dateString].netCalories -= session.caloriesBurned || 0
      }
    })

    // Process activities
    activities.forEach((activity) => {
      const dateString = new Date(activity.date).toISOString().split("T")[0]
      if (dailySummaries[dateString]) {
        dailySummaries[dateString].activityCalories += activity.calories || 0
        dailySummaries[dateString].caloriesBurned += activity.calories || 0
        dailySummaries[dateString].netCalories -= activity.calories || 0
      }
    })

    // Process food entries
    foodEntries.forEach((entry) => {
      const dateString = new Date(entry.date).toISOString().split("T")[0]
      if (dailySummaries[dateString] && entry.food) {
        const calories = (entry.food.calories || 0) * (entry.quantity || 1)
        dailySummaries[dateString].caloriesConsumed += calories
        dailySummaries[dateString].netCalories += calories

        // Add macros
        dailySummaries[dateString].macros.protein += (entry.food.protein || 0) * (entry.quantity || 1)
        dailySummaries[dateString].macros.carbs += (entry.food.carbs || 0) * (entry.quantity || 1)
        dailySummaries[dateString].macros.fats += (entry.food.fats || 0) * (entry.quantity || 1)
      }
    })

    // Calculate totals
    const totalSummary = {
      startDate,
      endDate,
      totalCaloriesConsumed: Object.values(dailySummaries).reduce((sum, day) => sum + day.caloriesConsumed, 0),
      totalCaloriesBurned: Object.values(dailySummaries).reduce((sum, day) => sum + day.caloriesBurned, 0),
      totalWorkoutCalories: Object.values(dailySummaries).reduce((sum, day) => sum + day.workoutCalories, 0),
      totalActivityCalories: Object.values(dailySummaries).reduce((sum, day) => sum + day.activityCalories, 0),
      totalNetCalories: Object.values(dailySummaries).reduce((sum, day) => sum + day.netCalories, 0),
      dailySummaries: Object.values(dailySummaries),
      averageDailyCaloriesConsumed: 0,
      averageDailyCaloriesBurned: 0,
    }

    // Calculate weekly goals based on user data
    const daysCount = Object.keys(dailySummaries).length
    const weeklyCalorieGoal = 2000 * daysCount // Default 2000 calories per day
    const weeklyExerciseGoal = 7 // Default 1 activity per day
    const weeklyCalorieBurnGoal = 3500 // Default goal to burn 3500 calories per week (~ 1lb)

    // Calculate progress percentages
    const calorieGoalProgress = Math.min(
      Math.round((totalSummary.totalCaloriesConsumed / weeklyCalorieGoal) * 100),
      100,
    )
    const exerciseGoalProgress = Math.min(
      Math.round(
        ((totalSummary.totalWorkoutCalories + totalSummary.totalActivityCalories) / weeklyCalorieBurnGoal) * 100,
      ),
      100,
    )
    const activityGoalProgress = Math.min(
      Math.round((Object.keys(dailySummaries).length / weeklyExerciseGoal) * 100),
      100,
    )

    // Add weekly goals to the response
    totalSummary.weeklyGoals = {
      calorieGoal: weeklyCalorieGoal,
      exerciseGoal: weeklyExerciseGoal,
      calorieBurnGoal: weeklyCalorieBurnGoal,
      calorieGoalProgress,
      exerciseGoalProgress,
      activityGoalProgress,
    }

    // Calculate averages
    if (daysCount > 0) {
      totalSummary.averageDailyCaloriesConsumed = Math.round(totalSummary.totalCaloriesConsumed / daysCount)
      totalSummary.averageDailyCaloriesBurned = Math.round(totalSummary.totalCaloriesBurned / daysCount)
    }

    res.status(200).json(totalSummary)
  } catch (error) {
    console.error("Error getting date range summary:", error)
    res.status(500).json({ message: "Failed to get date range summary" })
  }
}

// Helper function to get all days in a date range
function getDaysInRange(startDate, endDate) {
  const days = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    days.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return days
}
