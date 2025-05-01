/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { FaDumbbell, FaRunning, FaFire, FaPlus } from "react-icons/fa"
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend } from "recharts"
import axiosInstance from "../../axiosInstance"
import { toast } from "react-toastify"

const activityTypes = [
  { label: "Running", calorieRate: 7 },
  { label: "Cycling", calorieRate: 5 },
  { label: "Swimming", calorieRate: 6 },
  { label: "Weight Training", calorieRate: 4 },
  { label: "Yoga", calorieRate: 3 },
]

const DAILY_CALORIE_GOAL = 2000 // 🎯 Set your target calories burned

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("This Week")
  const [completedSessions, setCompletedSessions] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [newActivity, setNewActivity] = useState({ activity: "", duration: "" })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [chartData, setChartData] = useState([])
  const [workoutCaloriesBurned, setWorkoutCaloriesBurned] = useState(0)
  const [activityCaloriesBurned, setActivityCaloriesBurned] = useState(0)
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [workoutRes, activityRes] = await Promise.all([
          axiosInstance.get("/workout-sessions"),
          axiosInstance.get("/activities"),
        ])
        setCompletedSessions(workoutRes.data)
        setRecentActivities(activityRes.data)
        generateChartData(workoutRes.data)
        calculateTotalCalories(workoutRes.data, activityRes.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast.error("Failed to load dashboard data!")
      }
    }

    fetchAllData()
  }, [timeRange])

  const fetchCompletedWorkouts = async () => {
    try {
      const response = await axiosInstance.get("/workout-sessions")
      setCompletedSessions(response.data)
      generateChartData(response.data)
      calculateTotalCalories(response.data, recentActivities)
    } catch (error) {
      console.error("Failed to fetch completed workouts:", error)
      toast.error("Failed to load completed workouts!")
    }
  }

  const generateChartData = (sessions) => {
    const typeMap = {
      Strength: 0,
      Cardio: 0,
      Hypertrophy: 0,
    }

    const now = new Date()
    const filteredSessions = sessions.filter((session) => {
      const sessionDate = new Date(session.completedAt)

      if (timeRange === "This Week") {
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        return sessionDate >= startOfWeek
      } else if (timeRange === "Last Week") {
        const startOfLastWeek = new Date(now)
        startOfLastWeek.setDate(now.getDate() - now.getDay() - 7)
        const endOfLastWeek = new Date(startOfLastWeek)
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6)
        return sessionDate >= startOfLastWeek && sessionDate <= endOfLastWeek
      } else if (timeRange === "This Month") {
        return sessionDate.getMonth() === now.getMonth() && sessionDate.getFullYear() === now.getFullYear()
      }
      return true
    })

    filteredSessions.forEach((session) => {
      if (session.planName.toLowerCase().includes("strength")) {
        typeMap.Strength++
      } else if (session.planName.toLowerCase().includes("cardio")) {
        typeMap.Cardio++
      } else if (session.planName.toLowerCase().includes("hypertrophy")) {
        typeMap.Hypertrophy++
      }
    })

    const chartArray = [
      { name: "Strength", Workouts: typeMap.Strength },
      { name: "Cardio", Workouts: typeMap.Cardio },
      { name: "Hypertrophy", Workouts: typeMap.Hypertrophy },
    ]

    setChartData(chartArray)
  }

  const calculateCalories = (activity, duration) => {
    const selectedActivity = activityTypes.find((item) => item.label === activity)
    return selectedActivity ? selectedActivity.calorieRate * duration : 0
  }

  const calculateTotalCalories = (sessions = completedSessions, activities = recentActivities) => {
    let workoutCalories = 0
    sessions.forEach((session) => {
      workoutCalories += session.caloriesBurned || 0
    })

    let activityCalories = 0
    activities.forEach((activity) => {
      activityCalories += activity.calories || 0
    })

    const total = workoutCalories + activityCalories

    setWorkoutCaloriesBurned(workoutCalories)
    setActivityCaloriesBurned(activityCalories)
    setTotalCaloriesBurned(total)
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

      toast.success("Activity added successfully!")
      setNewActivity({ activity: "", duration: "" })
      setIsModalOpen(false)

      // After adding, refresh recent activities
      fetchRecentActivities()
    } catch (error) {
      console.error("Failed to add activity:", error)
      toast.error("Failed to add activity!")
    }
  }

  const fetchRecentActivities = async () => {
    try {
      const response = await axiosInstance.get("/activities")
      setRecentActivities(response.data)
      calculateTotalCalories(completedSessions, response.data)
    } catch (error) {
      console.error("Failed to fetch recent activities:", error)
    }
  }

  const stats = [
    {
      title: "Workout Calories",
      value: workoutCaloriesBurned.toLocaleString() + " kcal",
      change: "+5% from last week",
      isPositive: true,
      icon: <FaDumbbell className="text-[#28A745]" />,
    },
    {
      title: "Activity Calories",
      value: activityCaloriesBurned.toLocaleString() + " kcal",
      change: "+10% from last week",
      isPositive: true,
      icon: <FaRunning className="text-[#28A745]" />,
    },
    {
      title: "Total Calories Burned",
      value: totalCaloriesBurned.toLocaleString() + " kcal",
      change: "+8.5%",
      isPositive: true,
      icon: <FaFire className="text-[#28A745]" />,
    },
  ]

  const progressPercent = Math.min((totalCaloriesBurned / DAILY_CALORIE_GOAL) * 100, 100)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#004D40]">Dashboard Overview</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#28A745] hover:bg-[#218838] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus /> Add Activity
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <h3 className="text-3xl font-bold text-[#004D40]">{stat.value}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#E8F5E9] flex items-center justify-center">{stat.icon}</div>
            </div>
            <div className="flex items-center">
              <span
                className={`text-sm font-medium flex items-center ${stat.isPositive ? "text-green-500" : "text-red-500"}`}
              >
                {stat.change}
              </span>
              <span className="text-gray-500 text-sm ml-2">Last 30 days</span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-[#004D40] mb-4">Calories Goal Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
          <div
            className="bg-[#28A745] h-6 rounded-full text-white flex items-center justify-center text-xs font-semibold transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          >
            {Math.round(progressPercent)}%
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          {totalCaloriesBurned.toLocaleString()} kcal burned / {DAILY_CALORIE_GOAL} kcal goal
        </p>
      </div>

      {/* Chart and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#004D40]">Workout Distribution</h3>
            <select
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#28A745]"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="This Week">This Week</option>
              <option value="Last Week">Last Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Workouts" fill="#28A745" animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#004D40]">Recent Activities</h3>
          </div>

          {recentActivities.length === 0 ? (
            <div className="text-center py-10">
              <FaRunning className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500">No recent activities yet. Start by adding one!</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 bg-[#28A745] hover:bg-[#218838] text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <FaPlus /> Add Activity
              </button>
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
