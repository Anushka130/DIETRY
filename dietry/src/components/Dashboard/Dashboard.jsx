import { useState } from "react"
import { FaSearch, FaBell } from "react-icons/fa"
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
} from "recharts"

const workoutData = [
  { name: "Mon", Cardio: 40, Strength: 24, Flexibility: 10 },
  { name: "Tue", Cardio: 30, Strength: 38, Flexibility: 15 },
  { name: "Wed", Cardio: 20, Strength: 45, Flexibility: 20 },
  { name: "Thu", Cardio: 27, Strength: 39, Flexibility: 12 },
  { name: "Fri", Cardio: 18, Strength: 48, Flexibility: 14 },
  { name: "Sat", Cardio: 23, Strength: 38, Flexibility: 16 },
  { name: "Sun", Cardio: 34, Strength: 43, Flexibility: 18 },
]

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("This Week")

  return (
    <div className="flex-1 transition-all duration-300">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-[#004D40]">Overview</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28A745] focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <FaBell className="text-gray-500" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 bg-gray-50">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Completed Workouts */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm">Completed Workouts</p>
                <h3 className="text-3xl font-bold text-[#004D40]">8,360</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#28A745]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-red-500 text-sm font-medium flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 13a1 1 0 10-2 0v4a1 1 0 102 0v-4z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                </svg>
                12.54%
              </span>
              <span className="text-gray-500 text-sm ml-2">Last 30 days</span>
            </div>
          </div>

          {/* Calories Burned */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm">Calories Burned</p>
                <h3 className="text-3xl font-bold text-[#004D40]">543,583</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#28A745]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v4a1 1 0 102 0V7z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                </svg>
                28.14%
              </span>
              <span className="text-gray-500 text-sm ml-2">Last 30 days</span>
            </div>
          </div>
        </div>

        {/* Workout Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                <BarChart data={workoutData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Cardio" fill="#28A745" />
                  <Bar dataKey="Strength" fill="#004D40" />
                  <Bar dataKey="Flexibility" fill="#A5D6A7" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#004D40]">Recent Activity</h3>
            <button className="text-[#28A745] hover:underline text-sm font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calories</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {["Running", "Cycling", "Swimming", "Weight Training", "Yoga"][item - 1]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {[45, 30, 60, 50, 40][item - 1]} minutes
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {[320, 250, 400, 280, 180][item - 1]} kcal
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(Date.now() - item * 86400000).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
