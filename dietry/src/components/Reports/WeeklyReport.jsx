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
  FaRunning,
  FaAppleAlt,
  FaWeight,
} from "react-icons/fa"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import axios from "axios"
import { toast } from "react-toastify"

const WeeklyReport = () => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
    weekNumber: 0,
  })
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState(null)

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
      // Format dates for API request
      const startDateStr = dateRange.startDate.toISOString().split("T")[0]
      const endDateStr = dateRange.endDate.toISOString().split("T")[0]

      // Use the new reports endpoint
      const token = JSON.parse(sessionStorage.getItem("diet-user"))?.token
      const response = await axios.get(`http://localhost:5000/api/reports/weekly`, {
        params: {
          startDate: startDateStr,
          endDate: endDateStr,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setReportData(response.data)
    } catch (error) {
      console.error("Error fetching report data:", error)
      toast.error("Failed to load weekly report data")
    } finally {
      setLoading(false)
    }
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
    if (!reportData) return []

    const { mealBreakdown } = reportData.summary.foodSummary
    return Object.entries(mealBreakdown)
      .map(([name, data]) => ({
        name,
        calories: Math.round(data.calories),
        protein: Math.round(data.protein),
        carbs: Math.round(data.carbs),
        fats: Math.round(data.fats),
      }))
      .sort((a, b) => b.calories - a.calories)
  }

  // Prepare data for daily calories chart
  const prepareDailyCaloriesData = () => {
    if (!reportData) return []

    return reportData.dateRange.days.map((day) => {
      const dayData = reportData.details.dailySummary[day]
      const date = new Date(day)
      const formattedDate = `${date.toLocaleDateString("en-US", { weekday: "short" })} ${date.getMonth() + 1}/${date.getDate()}`

      return {
        date: formattedDate,
        consumed: Math.round(dayData.caloriesConsumed),
        burned: Math.round(dayData.caloriesBurned),
        net: Math.round(dayData.netCalories),
        fullDate: day,
      }
    })
  }

  // Prepare data for workout distribution chart
  const prepareWorkoutDistributionData = () => {
    if (!reportData) return []

    return Object.entries(reportData.details.workoutsByCategory).map(([category, data]) => ({
      name: category,
      count: data.count,
      duration: Math.round(data.duration),
      calories: Math.round(data.caloriesBurned),
    }))
  }

  // Prepare data for macronutrient breakdown
  const prepareMacronutrientData = () => {
    if (!reportData) return []

    const { totalProtein, totalCarbs, totalFats } = reportData.summary.foodSummary
    return [
      { name: "Protein", value: Math.round(totalProtein), color: "#4CAF50" },
      { name: "Carbs", value: Math.round(totalCarbs), color: "#2196F3" },
      { name: "Fats", value: Math.round(totalFats), color: "#FFC107" },
    ]
  }

  // Prepare data for daily macros chart
  const prepareDailyMacrosData = () => {
    if (!reportData) return []

    return reportData.dateRange.days.map((day) => {
      const dayData = reportData.details.dailySummary[day]
      const date = new Date(day)
      const formattedDate = `${date.toLocaleDateString("en-US", { weekday: "short" })} ${date.getMonth() + 1}/${date.getDate()}`

      return {
        date: formattedDate,
        protein: Math.round(dayData.protein),
        carbs: Math.round(dayData.carbs),
        fats: Math.round(dayData.fats),
        fullDate: day,
      }
    })
  }

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

      {reportData ? (
        <>
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
                  <span className="font-medium">
                    {reportData.summary.caloriesSummary.consumed.toLocaleString()} kcal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Burned</span>
                  <span className="font-medium">{reportData.summary.caloriesSummary.burned.toLocaleString()} kcal</span>
                </div>
                <div className="h-px bg-gray-200 my-2"></div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Net Calories</span>
                  <span
                    className={`font-bold ${reportData.summary.caloriesSummary.net > 0 ? "text-orange-500" : "text-green-500"}`}
                  >
                    {reportData.summary.caloriesSummary.net.toLocaleString()} kcal
                  </span>
                </div>
              </div>
            </div>

            {/* Exercise Summary */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#004D40]">Exercise Summary</h2>
                <div className="h-10 w-10 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                  <FaDumbbell className="text-[#28A745]" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Workouts</span>
                  <span className="font-medium">{reportData.summary.exerciseSummary.totalWorkouts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Activities</span>
                  <span className="font-medium">{reportData.summary.exerciseSummary.totalActivities}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Duration</span>
                  <span className="font-medium">{reportData.summary.exerciseSummary.totalDuration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Calories Burned</span>
                  <span className="font-medium">
                    {reportData.summary.exerciseSummary.totalCaloriesBurned.toLocaleString()} kcal
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
                  <span className="font-medium">
                    {reportData.summary.foodSummary.totalCalories.toLocaleString()} kcal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Average</span>
                  <span className="font-medium">
                    {reportData.summary.foodSummary.averageCalories.toLocaleString()} kcal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Protein</span>
                  <span className="font-medium">{Math.round(reportData.summary.foodSummary.totalProtein)} g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carbs</span>
                  <span className="font-medium">{Math.round(reportData.summary.foodSummary.totalCarbs)} g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fats</span>
                  <span className="font-medium">{Math.round(reportData.summary.foodSummary.totalFats)} g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Daily Calories Chart */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-[#004D40] mb-4 flex items-center">
                <FaFire className="mr-2 text-[#28A745]" /> Daily Calorie Balance
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareDailyCaloriesData()} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
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
                      formatter={(value, name) => {
                        const formattedName = name === "consumed" ? "Consumed" : name === "burned" ? "Burned" : "Net"
                        return [`${value} kcal`, formattedName]
                      }}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="consumed" name="Consumed" fill="#FF9800" />
                    <Bar dataKey="burned" name="Burned" fill="#28A745" />
                    <Bar dataKey="net" name="Net" fill="#2196F3" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Meal Breakdown Chart */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-[#004D40] mb-4 flex items-center">
                <FaUtensils className="mr-2 text-[#28A745]" /> Calories by Meal Type
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareMealBreakdownData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Bar dataKey="calories" name="Calories" fill="#28A745" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Macronutrient Breakdown */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-[#004D40] mb-4 flex items-center">
                <FaAppleAlt className="mr-2 text-[#28A745]" /> Macronutrient Breakdown
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareMacronutrientData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {prepareMacronutrientData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}g`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                {prepareMacronutrientData().map((macro, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-bold text-lg" style={{ color: macro.color }}>
                      {macro.value}g
                    </div>
                    <div className="text-sm text-gray-600">{macro.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workout Distribution */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-[#004D40] mb-4 flex items-center">
                <FaDumbbell className="mr-2 text-[#28A745]" /> Workout Distribution
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareWorkoutDistributionData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Sessions" fill="#4CAF50" />
                    <Bar dataKey="calories" name="Calories Burned" fill="#FF9800" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Macros Trend */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-[#004D40] mb-4 flex items-center">
                <FaWeight className="mr-2 text-[#28A745]" /> Daily Macros Trend
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prepareDailyMacrosData()} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
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
                    <Tooltip formatter={(value) => `${value}g`} />
                    <Legend />
                    <Line type="monotone" dataKey="protein" name="Protein" stroke="#4CAF50" strokeWidth={2} />
                    <Line type="monotone" dataKey="carbs" name="Carbs" stroke="#2196F3" strokeWidth={2} />
                    <Line type="monotone" dataKey="fats" name="Fats" stroke="#FFC107" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-[#004D40] mb-4 flex items-center">
                <FaRunning className="mr-2 text-[#28A745]" /> Activity Summary
              </h2>
              <div className="space-y-4">
                {Object.entries(reportData.details.activitiesByType).map(([type, data], index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800">{type}</span>
                      <span className="text-sm text-gray-600">{data.count} sessions</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Duration: {data.duration} min</span>
                      <span>Calories: {Math.round(data.caloriesBurned)} kcal</span>
                    </div>
                  </div>
                ))}
                {Object.keys(reportData.details.activitiesByType).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FaRunning className="mx-auto text-gray-300 text-4xl mb-3" />
                    <p>No activities recorded for this period</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Weekly Progress Summary */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-[#004D40] mb-4 flex items-center">
              <FaChartLine className="mr-2 text-[#28A745]" /> Weekly Progress
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-around py-6">
              <div className="text-center mb-6 md:mb-0">
                <div className="text-6xl font-bold text-[#28A745] mb-2">
                  {reportData.summary.exerciseSummary.totalWorkouts +
                    reportData.summary.exerciseSummary.totalActivities}
                </div>
                <p className="text-gray-600">Total Activities</p>
              </div>

              <div className="text-center mb-6 md:mb-0">
                <div className="text-6xl font-bold text-[#28A745] mb-2">
                  {Math.round(reportData.summary.exerciseSummary.totalDuration / 60)}
                </div>
                <p className="text-gray-600">Hours of Exercise</p>
              </div>

              <div className="text-center">
                <div className="text-6xl font-bold text-[#28A745] mb-2">
                  {Math.abs(reportData.summary.caloriesSummary.net).toLocaleString()}
                </div>
                <p className="text-gray-600">
                  {reportData.summary.caloriesSummary.net <= 0 ? "Calorie Deficit" : "Calorie Surplus"}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <FaChartLine className="text-gray-300 text-6xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h2>
          <p className="text-gray-500 mb-6">
            There is no data available for this period. Try selecting a different date range or add some entries to your
            food diary and workout log.
          </p>
        </div>
      )}
    </div>
  )
}

export default WeeklyReport
