"use client"

import { useState, useEffect } from "react"
import {
  FaCalendarAlt,
  FaFire,
  FaDumbbell,
  FaUtensils,
  FaChevronLeft,
  FaChevronRight,
  FaChartLine,
} from "react-icons/fa"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import axiosInstance from "../../axiosInstance"
import { toast } from "react-toastify"

const WeeklyReport = () => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
    weekNumber: 0,
  })
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState({
    workouts: [],
    foodEntries: [],
    activities: [],
    caloriesSummary: {
      consumed: 0,
      burned: 0,
      net: 0,
      workoutCalories: 0,
      activityCalories: 0,
    },
    exerciseSummary: {
      totalActivities: 0,
      totalDuration: 0,
      totalCaloriesBurned: 0,
    },
    foodSummary: {
      averageCalories: 0,
      totalCalories: 0,
      mealBreakdown: {
        Breakfast: 0,
        Lunch: 0,
        Dinner: 0,
        Snacks: 0,
      },
    },
    dailyCalories: [],
    weeklyGoals: null,
  })

  // Initialize date range for current week
  useEffect(() => {
    setCurrentWeek()
  }, [])

  // Fetch data whenever date range changes
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchReportData()
    }
  }, [dateRange])

  const setCurrentWeek = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Calculate the start of the week (Sunday)
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - dayOfWeek)
    startDate.setHours(0, 0, 0, 0)

    // Calculate the end of the week (Saturday)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
    endDate.setHours(23, 59, 59, 999)

    setDateRange({
      startDate,
      endDate,
      weekNumber: 0, // Current week
    })
  }

  const changeWeek = (direction) => {
    const newStartDate = new Date(dateRange.startDate)
    const newEndDate = new Date(dateRange.endDate)
    const newWeekNumber = dateRange.weekNumber + direction

    // Adjust dates by 7 days
    newStartDate.setDate(newStartDate.getDate() + 7 * direction)
    newEndDate.setDate(newEndDate.getDate() + 7 * direction)

    setDateRange({
      startDate: newStartDate,
      endDate: newEndDate,
      weekNumber: newWeekNumber,
    })
  }

  const fetchReportData = async () => {
    setLoading(true)
    try {
      // Format dates for API requests
      const startDateStr = dateRange.startDate.toISOString().split("T")[0]
      const endDateStr = dateRange.endDate.toISOString().split("T")[0]

      // Get calorie summary for the date range
      const [calorieSummaryRes, weeklyGoalsRes] = await Promise.all([
        axiosInstance.get("/calories/range", {
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
          },
        }),
        axiosInstance.get("/calories/weekly-goals"),
      ])

      // Get weekly goals
      const weeklyGoals = weeklyGoalsRes.data

      // Fetch workout sessions
      const workoutResponse = await axiosInstance.get("/workout-sessions")

      // Fetch activities
      const activitiesResponse = await axiosInstance.get("/activities")

      // Filter data for the selected date range
      const filteredWorkouts = workoutResponse.data.filter((session) =>
        isDateInRange(new Date(session.completedAt), dateRange.startDate, dateRange.endDate),
      )

      const filteredActivities = activitiesResponse.data.filter((activity) =>
        isDateInRange(new Date(activity.date), dateRange.startDate, dateRange.endDate),
      )

      // Calculate combined exercise summary (workouts + activities)
      const exerciseSummary = {
        totalActivities: filteredWorkouts.length + filteredActivities.length,
        totalDuration:
          filteredWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0) +
          filteredActivities.reduce((sum, activity) => sum + (activity.duration || 0), 0),
        totalCaloriesBurned:
          filteredWorkouts.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0) +
          filteredActivities.reduce((sum, activity) => sum + (activity.calories || 0), 0),
      }

      // Get calorie summary data
      const caloriesSummary = {
        consumed: calorieSummaryRes.data.totalCaloriesConsumed || 0,
        burned: calorieSummaryRes.data.totalCaloriesBurned || 0,
        net: calorieSummaryRes.data.totalNetCalories || 0,
        workoutCalories: calorieSummaryRes.data.totalWorkoutCalories || 0,
        activityCalories: calorieSummaryRes.data.totalActivityCalories || 0,
      }

      // Process daily calorie data
      const dailyCalories = calorieSummaryRes.data.dailySummaries.map((day) => ({
        date: new Date(day.date).toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" }),
        consumed: day.caloriesConsumed,
        burned: day.caloriesBurned,
        net: day.netCalories,
        fullDate: day.date,
      }))

      // Sort dailyCalories by date
      dailyCalories.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate))

      // Calculate meal breakdown from the calorie summary data
      const mealBreakdown = {
        Breakfast: 0,
        Lunch: 0,
        Dinner: 0,
        Snacks: 0,
      }

      // Process food entries from daily summaries
      calorieSummaryRes.data.dailySummaries.forEach((day) => {
        // This is a simplification - in a real implementation, you'd need to fetch actual meal breakdown data
        // For now, we'll estimate based on typical meal distributions
        mealBreakdown.Breakfast += day.caloriesConsumed * 0.25
        mealBreakdown.Lunch += day.caloriesConsumed * 0.35
        mealBreakdown.Dinner += day.caloriesConsumed * 0.3
        mealBreakdown.Snacks += day.caloriesConsumed * 0.1
      })

      // Calculate food summary
      const foodSummary = {
        totalCalories: caloriesSummary.consumed,
        averageCalories: Math.round(caloriesSummary.consumed / 7),
        mealBreakdown,
      }

      setReportData({
        workouts: filteredWorkouts,
        activities: filteredActivities,
        caloriesSummary,
        exerciseSummary,
        foodSummary,
        dailyCalories,
        weeklyGoals, // Add the weekly goals to the report data
      })
    } catch (error) {
      console.error("Error fetching report data:", error)
      toast.error("Failed to load weekly report data")
    } finally {
      setLoading(false)
    }
  }

  // Helper function to check if a date is within a range
  const isDateInRange = (date, startDate, endDate) => {
    return date >= startDate && date <= endDate
  }

  // Format date range for display
  const formatDateRange = () => {
    if (!dateRange.startDate || !dateRange.endDate) return "Loading..."

    const options = { month: "short", day: "numeric", year: "numeric" }
    const start = dateRange.startDate.toLocaleDateString("en-US", options)
    const end = dateRange.endDate.toLocaleDateString("en-US", options)

    return `${start} - ${end}`
  }

  // Prepare data for meal breakdown chart
  const prepareMealBreakdownData = () => {
    const { mealBreakdown } = reportData.foodSummary
    return Object.entries(mealBreakdown)
      .map(([name, calories]) => ({
        name,
        calories: Math.round(calories),
      }))
      .sort((a, b) => b.calories - a.calories) // Sort by calories in descending order
  }

  // Prepare data for calorie source breakdown
  const prepareCalorieSourceData = () => {
    return [
      { name: "Food", value: reportData.caloriesSummary.consumed },
      { name: "Workouts", value: reportData.caloriesSummary.workoutCalories },
      { name: "Activities", value: reportData.caloriesSummary.activityCalories },
    ]
  }

  // Colors for pie charts
  const COLORS = ["#FF9800", "#28A745", "#2196F3", "#9C27B0"]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#28A745]"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with date navigation */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#004D40]">Weekly Report</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => changeWeek(-1)} className="text-[#28A745] hover:text-[#218838]">
            <FaChevronLeft />
          </button>
          <div className="flex items-center">
            <FaCalendarAlt className="text-[#28A745] mr-2" />
            <span className="font-medium">{formatDateRange()}</span>
          </div>
          <button
            onClick={() => changeWeek(1)}
            className="text-[#28A745] hover:text-[#218838]"
            disabled={dateRange.weekNumber >= 0}
          >
            <FaChevronRight className={dateRange.weekNumber >= 0 ? "text-gray-300 cursor-not-allowed" : ""} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Calories Summary */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#004D40]">Calories Summary</h2>
            <div className="h-10 w-10 rounded-full bg-[#E8F5E9] flex items-center justify-center">
              <FaFire className="text-[#28A745]" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Consumed</span>
              <span className="font-medium">{reportData.caloriesSummary.consumed.toLocaleString()} kcal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Burned</span>
              <span className="font-medium">{reportData.caloriesSummary.burned.toLocaleString()} kcal</span>
            </div>
            <div className="h-px bg-gray-200 my-2"></div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Net Calories</span>
              <span
                className={`font-bold ${reportData.caloriesSummary.net > 0 ? "text-orange-500" : "text-green-500"}`}
              >
                {reportData.caloriesSummary.net.toLocaleString()} kcal
              </span>
            </div>
          </div>
        </div>

        {/* Exercise Summary (Combined Workouts & Activities) */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#004D40]">Exercise Summary</h2>
            <div className="h-10 w-10 rounded-full bg-[#E8F5E9] flex items-center justify-center">
              <FaDumbbell className="text-[#28A745]" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Activities</span>
              <span className="font-medium">{reportData.exerciseSummary.totalActivities}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Duration</span>
              <span className="font-medium">{reportData.exerciseSummary.totalDuration} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Calories Burned</span>
              <span className="font-medium">
                {reportData.exerciseSummary.totalCaloriesBurned.toLocaleString()} kcal
              </span>
            </div>
          </div>
        </div>

        {/* Food Summary */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#004D40]">Food Summary</h2>
            <div className="h-10 w-10 rounded-full bg-[#E8F5E9] flex items-center justify-center">
              <FaUtensils className="text-[#28A745]" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Calories</span>
              <span className="font-medium">{reportData.foodSummary.totalCalories.toLocaleString()} kcal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Daily Average</span>
              <span className="font-medium">{reportData.foodSummary.averageCalories.toLocaleString()} kcal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Calorie Sources</span>
              <span className="font-medium">{Object.keys(reportData.foodSummary.mealBreakdown).length} meal types</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Calories Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-[#004D40] mb-4 flex items-center">
            <FaUtensils className="mr-2 text-[#28A745]" /> Daily Calorie Intake vs. Burned
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData.dailyCalories} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  formatter={(value) => [`${value} kcal`, "Calories"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Bar dataKey="consumed" name="Calories Consumed" fill="#FF9800" />
                <Bar dataKey="burned" name="Calories Burned" fill="#28A745" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calorie Sources Pie Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-[#004D40] mb-4 flex items-center">
            <FaFire className="mr-2 text-[#28A745]" /> Calorie Sources
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareCalorieSourceData()}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {prepareCalorieSourceData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()} kcal`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Meal Breakdown Chart */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-[#004D40] mb-4 flex items-center">
          <FaUtensils className="mr-2 text-[#28A745]" /> Calories by Meal Type
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={prepareMealBreakdownData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip formatter={(value) => `${value.toLocaleString()} kcal`} />
              <Bar dataKey="calories" fill="#FF9800" name="Calories" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Progress Summary */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-[#004D40] mb-4 flex items-center">
          <FaChartLine className="mr-2 text-[#28A745]" /> Weekly Progress
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-around py-6">
          <div className="text-center mb-6 md:mb-0">
            <div className="text-6xl font-bold text-[#28A745] mb-2">{reportData.exerciseSummary.totalActivities}</div>
            <p className="text-gray-600">Total Activities</p>
          </div>

          <div className="text-center">
            <div className="text-6xl font-bold text-[#28A745] mb-2">
              {Math.abs(reportData.caloriesSummary.net).toLocaleString()}
            </div>
            <p className="text-gray-600">
              {reportData.caloriesSummary.net <= 0 ? "Calorie Deficit" : "Calorie Surplus"}
            </p>
          </div>
        </div>

        {/* Add weekly goal progress */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="font-semibold text-gray-700 mb-3">Progress Toward Weekly Goals</h3>

          {/* Calorie Goal Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">Weekly Calorie Goal</span>
              <span className="text-sm font-medium">
                {reportData.caloriesSummary.consumed.toLocaleString()} /{" "}
                {(reportData.weeklyGoals?.weeklyCalorieGoal || 14000).toLocaleString()} kcal
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-orange-400 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((reportData.caloriesSummary.consumed / (reportData.weeklyGoals?.weeklyCalorieGoal || 14000)) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Exercise Goal Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">Weekly Exercise Goal</span>
              <span className="text-sm font-medium">
                {reportData.exerciseSummary.totalActivities} / {reportData.weeklyGoals?.weeklyExerciseGoal || 7}{" "}
                activities
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-400 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((reportData.exerciseSummary.totalActivities / (reportData.weeklyGoals?.weeklyExerciseGoal || 7)) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Calorie Burn Goal Progress */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">Weekly Calorie Burn Goal</span>
              <span className="text-sm font-medium">
                {reportData.caloriesSummary.burned.toLocaleString()} /{" "}
                {(reportData.weeklyGoals?.weeklyCalorieBurnGoal || 3500).toLocaleString()} kcal
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-400 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((reportData.caloriesSummary.burned / (reportData.weeklyGoals?.weeklyCalorieBurnGoal || 3500)) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeeklyReport
