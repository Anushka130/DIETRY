/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect, useContext } from "react"
import {
  FaRunning,
  FaFire,
  FaPlus,
  FaUtensils,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaChartBar,
  FaCalculator,
} from "react-icons/fa"
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import axiosInstance from "../../axiosInstance"
import { toast } from "react-toastify"
import { UserContext } from "../../contexts/UserContext"
import { useNavigate } from "react-router-dom"
import QuickFoodEntry from "../Food/QuickFoodEntry"

const activityTypes = [
  { label: "Running", calorieRate: 7 },
  { label: "Cycling", calorieRate: 5 },
  { label: "Swimming", calorieRate: 6 },
  { label: "Weight Training", calorieRate: 4 },
  { label: "Yoga", calorieRate: 3 },
]

// Daily calorie goal based on user's goal
const getCalorieGoal = (user) => {
  if (!user) return 2000

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
  if (user.goal === "lose_weight") return Math.round(tdee - 500) // Deficit for weight loss
  if (user.goal === "gain_muscle") return Math.round(tdee + 300) // Surplus for muscle gain
  return Math.round(tdee) // Maintenance
}

const Dashboard = () => {
  const { loggedUser } = useContext(UserContext)
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [completedSessions, setCompletedSessions] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [foodEntries, setFoodEntries] = useState([])
  const [newActivity, setNewActivity] = useState({ activity: "", duration: "" })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [calorieData, setCalorieData] = useState({
    consumed: 0,
    burned: 0,
    workoutCalories: 0,
    activityCalories: 0,
    net: 0,
  })
  const [weeklyCalorieData, setWeeklyCalorieData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const DAILY_CALORIE_GOAL = getCalorieGoal(loggedUser)

  useEffect(() => {
    fetchAllData()

    // Check if we need to refresh data (e.g., after completing a workout)
    const refreshNeeded = sessionStorage.getItem("dashboard_refresh_needed")
    if (refreshNeeded === "true") {
      // Clear the flag
      sessionStorage.removeItem("dashboard_refresh_needed")
      // Refresh data again to ensure we have the latest
      fetchAllData()
    }
  }, [currentDate])

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      // Fetch today's data
      const dateString = currentDate.toISOString().split("T")[0]

      // Get daily calorie summary
      const calorieSummaryRes = await axiosInstance.get(`/calories/daily/${dateString}`)

      // Get workout sessions and activities for charts
      const [workoutRes, activityRes] = await Promise.all([
        axiosInstance.get("/workout-sessions"),
        axiosInstance.get("/activities"),
      ])

      // Get food entries for today
      const foodRes = await fetch(`http://localhost:5000/food/diary/${dateString}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("diet-user"))?.token}`,
        },
      })
      const foodData = await foodRes.json()

      // Get weekly data for charts
      const today = new Date()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      const endOfWeek = new Date(today)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      const weeklyRes = await axiosInstance.get("/calories/range", {
        params: {
          startDate: startOfWeek.toISOString().split("T")[0],
          endDate: endOfWeek.toISOString().split("T")[0],
        },
      })

      // Update state with all the data
      setCompletedSessions(workoutRes.data)
      setRecentActivities(activityRes.data)
      setFoodEntries(foodData)

      // Set calorie data from summary
      setCalorieData({
        consumed: calorieSummaryRes.data.caloriesConsumed || 0,
        burned: calorieSummaryRes.data.caloriesBurned || 0,
        workoutCalories: calorieSummaryRes.data.workoutCalories || 0,
        activityCalories: calorieSummaryRes.data.activityCalories || 0,
        net: calorieSummaryRes.data.netCalories || 0,
      })

      // Process weekly data for charts
      setWeeklyCalorieData(
        weeklyRes.data.dailySummaries.map((day) => ({
          date: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
          consumed: day.caloriesConsumed,
          burned: day.caloriesBurned,
          net: day.netCalories,
        })),
      )
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data!")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateCalories = (activity, duration) => {
    const selectedActivity = activityTypes.find((item) => item.label === activity)
    return selectedActivity ? selectedActivity.calorieRate * duration : 0
  }

  const handleAddActivity = async (e) => {
    e.preventDefault()
    if (!newActivity.activity || !newActivity.duration) return

    const calories = calculateCalories(newActivity.activity, Number.parseInt(newActivity.duration))

    try {
      await axiosInstance.post("/activities", {
        activity: newActivity.activity,
        duration: Number.parseInt(newActivity.duration),
        calories,
      })

      // Set flag to refresh dashboard data
      sessionStorage.setItem("dashboard_refresh_needed", "true")

      toast.success("Activity added successfully!")
      setNewActivity({ activity: "", duration: "" })
      setIsModalOpen(false)

      // After adding, refresh data
      fetchAllData()
    } catch (error) {
      console.error("Failed to add activity:", error)
      toast.error("Failed to add activity!")
    }
  }

  const goToPreviousDay = () => {
    const prevDay = new Date(currentDate)
    prevDay.setDate(prevDay.getDate() - 1)
    setCurrentDate(prevDay)
  }

  const goToNextDay = () => {
    const nextDay = new Date(currentDate)
    nextDay.setDate(nextDay.getDate() + 1)
    setCurrentDate(nextDay)
  }

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Calculate remaining calories
  const remainingCalories = DAILY_CALORIE_GOAL - calorieData.consumed + calorieData.burned

  // Prepare data for calorie breakdown pie chart
  const calorieBreakdownData = [
    { name: "Food", value: calorieData.consumed, color: "#FF9800" },
    { name: "Workouts", value: calorieData.workoutCalories, color: "#28A745" },
    { name: "Activities", value: calorieData.activityCalories, color: "#2196F3" },
  ]

  // Colors for pie chart
  const COLORS = ["#FF9800", "#28A745", "#2196F3"]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#28A745]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Date Navigation */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#004D40]">Dashboard Overview</h1>
        <div className="flex items-center gap-4">
          <button onClick={goToPreviousDay} className="text-[#28A745] hover:text-[#218838]">
            <FaChevronLeft />
          </button>
          <div className="flex items-center">
            <FaCalendarAlt className="text-[#28A745] mr-2" />
            <span className="font-medium">{formattedDate}</span>
          </div>
          <button onClick={goToNextDay} className="text-[#28A745] hover:text-[#218838]">
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Daily Calorie Summary */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-[#004D40] mb-4">Daily Calorie Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-400">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Calories Consumed</h3>
              <FaUtensils className="text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-orange-500">{calorieData.consumed.toLocaleString()} kcal</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Calories Burned</h3>
              <FaFire className="text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-500">{calorieData.burned.toLocaleString()} kcal</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Net Calories</h3>
              <FaChartBar className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-500">{calorieData.net.toLocaleString()} kcal</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Remaining</h3>
              <FaCalculator className="text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-purple-500">{remainingCalories.toLocaleString()} kcal</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Daily Goal Progress</span>
            <span className="text-sm font-medium">
              {calorieData.consumed.toLocaleString()} / {DAILY_CALORIE_GOAL.toLocaleString()} kcal
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-orange-400 h-4 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((calorieData.consumed / DAILY_CALORIE_GOAL) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quick Add and Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Food Entry */}
        <div className="lg:col-span-1">
          <QuickFoodEntry onFoodAdded={fetchAllData} />
        </div>

        {/* Weekly Calorie Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-[#004D40] mb-4">Weekly Calorie Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyCalorieData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Legend />
                <Bar dataKey="consumed" name="Calories Consumed" fill="#FF9800" />
                <Bar dataKey="burned" name="Calories Burned" fill="#28A745" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Calorie Breakdown */}
      <div className="grid grid-cols-1 gap-6">
        {/* Calorie Breakdown Pie Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-[#004D40] mb-4">Calorie Breakdown</h2>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={calorieBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {calorieBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()} kcal`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities and Food Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#004D40]">Recent Activities</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#28A745] hover:bg-[#218838] text-white px-3 py-1 rounded-lg flex items-center gap-1 transition-colors text-sm"
            >
              <FaPlus size={12} /> Add Activity
            </button>
          </div>

          {recentActivities.length === 0 ? (
            <div className="text-center py-10">
              <FaRunning className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500">No recent activities yet. Start by adding one!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <tr>
                    <th className="py-3 px-6 text-left">Activity</th>
                    <th className="py-3 px-6 text-center">Duration</th>
                    <th className="py-3 px-6 text-center">Calories</th>
                    <th className="py-3 px-6 text-center">Date</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm font-light">
                  {recentActivities.slice(0, 5).map((activity, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-100 transition">
                      <td className="py-3 px-6 text-left whitespace-nowrap">{activity.activity}</td>
                      <td className="py-3 px-6 text-center">{activity.duration} min</td>
                      <td className="py-3 px-6 text-center">{activity.calories} kcal</td>
                      <td className="py-3 px-6 text-center">{new Date(activity.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Today's Food Entries */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#004D40]">Today's Food</h3>
            <button
              onClick={() => navigate("/food/diary")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 transition-colors text-sm"
            >
              <FaUtensils size={12} /> Food Diary
            </button>
          </div>

          {foodEntries.length === 0 ? (
            <div className="text-center py-10">
              <FaUtensils className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500">No food entries for today. Add some in your food diary!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <tr>
                    <th className="py-3 px-6 text-left">Food</th>
                    <th className="py-3 px-6 text-center">Meal</th>
                    <th className="py-3 px-6 text-center">Calories</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm font-light">
                  {foodEntries.slice(0, 5).map((entry, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-100 transition">
                      <td className="py-3 px-6 text-left whitespace-nowrap">{entry.food?.name || "Unknown"}</td>
                      <td className="py-3 px-6 text-center">{entry.category}</td>
                      <td className="py-3 px-6 text-center">{entry.food?.calories || 0} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Activity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-[#004D40] text-center">Add Activity</h2>
            <form onSubmit={handleAddActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745]"
                  value={newActivity.activity}
                  onChange={(e) => setNewActivity({ ...newActivity, activity: e.target.value })}
                  required
                >
                  <option value="">Select Activity</option>
                  {activityTypes.map((type) => (
                    <option key={type.label} value={type.label}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745]"
                  value={newActivity.duration}
                  onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-[#28A745] text-white px-4 py-2 rounded-md hover:bg-[#218838]">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
