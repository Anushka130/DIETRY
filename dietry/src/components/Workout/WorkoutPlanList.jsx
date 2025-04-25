// components/Workout/WorkoutPlanList.jsx
import { useState } from "react"
import { 
  FaPlus, 
  FaChevronRight, 
  FaDumbbell, 
  FaClock, 
  FaChartBar, 
  FaCalendarAlt 
} from "react-icons/fa"

const WorkoutPlanList = ({ plans, onSelectPlan, onCreatePlan }) => {
  const [activeTab, setActiveTab] = useState("all")

  const filteredPlans = activeTab === "all" 
    ? plans 
    : plans.filter((plan) => plan.category.toLowerCase() === activeTab.toLowerCase())

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#004D40]">Workout Plans</h1>
        <button 
          onClick={onCreatePlan}
          className="flex items-center gap-2 bg-[#28A745] text-white px-4 py-2 rounded-lg hover:bg-[#218838] transition-colors"
        >
          <FaPlus className="text-sm" /> Create Plan
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
        <button
          className={`py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === "all" 
              ? "bg-[#28A745] text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-[#E8F5E9]"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Plans
        </button>
        <button
          className={`py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === "strength" 
              ? "bg-[#28A745] text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-[#E8F5E9]"
          }`}
          onClick={() => setActiveTab("strength")}
        >
          Strength
        </button>
        <button
          className={`py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === "cardio" 
              ? "bg-[#28A745] text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-[#E8F5E9]"
          }`}
          onClick={() => setActiveTab("cardio")}
        >
          Cardio
        </button>
        <button
          className={`py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === "hypertrophy" 
              ? "bg-[#28A745] text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-[#E8F5E9]"
          }`}
          onClick={() => setActiveTab("hypertrophy")}
        >
          Hypertrophy
        </button>
      </div>

      {filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-[#004D40] to-[#00796B] text-white p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <p className="text-sm text-gray-100 mt-1">{plan.description}</p>
                  </div>
                  <span className="bg-white text-[#004D40] text-xs font-medium px-2 py-1 rounded">
                    {plan.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <FaDumbbell className="text-[#28A745] mr-2" />
                  <span className="text-sm text-gray-600">Difficulty: {plan.difficulty}</span>
                </div>
                <div className="flex items-center mb-4">
                  <FaClock className="text-[#28A745] mr-2" />
                  <span className="text-sm text-gray-600">
                    {plan.duration} • {plan.frequency}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-[#28A745]">{plan.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#28A745] h-2 rounded-full" 
                      style={{ width: `${plan.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 border-t border-gray-200 p-3">
                <button
                  onClick={() => onSelectPlan(plan.id)}
                  className="w-full text-[#28A745] hover:text-[#218838] font-medium flex justify-between items-center"
                >
                  View Details
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FaChartBar className="text-gray-300 text-5xl mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No {activeTab !== "all" ? activeTab : ""} Plans Yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md">
            You haven't created any {activeTab !== "all" ? activeTab : ""} workout plans yet. 
            Create your first one to get started.
          </p>
          <button
            onClick={onCreatePlan}
            className="flex items-center gap-2 bg-[#28A745] text-white px-4 py-2 rounded-lg hover:bg-[#218838] transition-colors"
          >
            <FaPlus className="text-sm" /> Create {activeTab !== "all" ? activeTab : ""} Plan
          </button>
        </div>
      )}

      <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-lg p-4 mt-6">
        <div className="flex items-start">
          <FaCalendarAlt className="text-[#28A745] mr-3 mt-1" />
          <div>
            <h3 className="font-medium text-gray-800">Upcoming Workouts</h3>
            <p className="text-sm text-gray-600 mt-1">
              You have a <span className="font-medium text-[#28A745]">Strength Builder</span> workout 
              scheduled for tomorrow at 6:00 PM.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkoutPlanList