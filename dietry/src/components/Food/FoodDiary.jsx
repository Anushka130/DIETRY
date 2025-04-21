"use client"

import { useState } from "react"
import { FaPlus, FaUtensils, FaCoffee, FaCarrot, FaCookieBite } from "react-icons/fa"
import AddFoodItem from "./AddFoodItem"

const FoodDiary = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showAddFood, setShowAddFood] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState("")

  // Format date as "Monday, April 21, 2025"
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Navigate to previous day
  const goToPreviousDay = () => {
    const prevDay = new Date(currentDate)
    prevDay.setDate(prevDay.getDate() - 1)
    setCurrentDate(prevDay)
  }

  // Navigate to next day
  const goToNextDay = () => {
    const nextDay = new Date(currentDate)
    nextDay.setDate(nextDay.getDate() + 1)
    setCurrentDate(nextDay)
  }

  // Handle opening the add food modal
  const handleAddFood = (meal) => {
    setSelectedMeal(meal)
    setShowAddFood(true)
  }

  // Meal sections
  const mealSections = [
    { name: "Breakfast", icon: <FaCoffee className="text-[#28A745]" /> },
    { name: "Lunch", icon: <FaUtensils className="text-[#28A745]" /> },
    { name: "Dinner", icon: <FaCarrot className="text-[#28A745]" /> },
    { name: "Snacks", icon: <FaCookieBite className="text-[#28A745]" /> },
  ]

  // Nutritional goals
  const nutritionalGoals = {
    calories: { total: 2240, unit: "kcal" },
    carbs: { total: 280, unit: "g" },
    fat: { total: 75, unit: "g" },
    protein: { total: 112, unit: "g" },
    sodium: { total: 2300, unit: "mg" },
    sugar: { total: 84, unit: "g" },
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h1 className="text-xl font-bold text-[#004D40] mb-4">Your Food Diary</h1>

        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-lg font-medium">Your Food Diary For:</div>
          <div className="flex items-center">
            <button onClick={goToPreviousDay} className="p-2 bg-[#004D40] text-white rounded-l-md hover:bg-[#00695C]">
              &lt;
            </button>
            <div className="px-4 py-2 bg-[#004D40] text-white font-medium">{formattedDate}</div>
            <button onClick={goToNextDay} className="p-2 bg-[#004D40] text-white rounded-r-md hover:bg-[#00695C]">
              &gt;
            </button>
            <button className="ml-2 p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Nutritional Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center font-medium text-sm">
          <div className="col-span-1"></div>
          <div className="bg-[#004D40] text-white p-2 rounded-t-md">
            <div>Calories</div>
            <div className="text-xs">kcal</div>
          </div>
          <div className="bg-[#004D40] text-white p-2 rounded-t-md">
            <div>Carbs</div>
            <div className="text-xs">g</div>
          </div>
          <div className="bg-[#004D40] text-white p-2 rounded-t-md">
            <div>Fat</div>
            <div className="text-xs">g</div>
          </div>
          <div className="bg-[#004D40] text-white p-2 rounded-t-md">
            <div>Protein</div>
            <div className="text-xs">g</div>
          </div>
          <div className="bg-[#004D40] text-white p-2 rounded-t-md">
            <div>Sodium</div>
            <div className="text-xs">mg</div>
          </div>
          <div className="bg-[#004D40] text-white p-2 rounded-t-md">
            <div>Sugar</div>
            <div className="text-xs">g</div>
          </div>
        </div>

        {/* Meal Sections */}
        {mealSections.map((meal, index) => (
          <div key={index} className="mb-6">
            <div className="flex items-center mb-2">
              <div className="mr-2">{meal.icon}</div>
              <h2 className="text-lg font-semibold text-[#004D40]">{meal.name}</h2>
            </div>

            <div className="flex mb-2">
              <button
                className="flex items-center text-[#28A745] hover:underline mr-4"
                onClick={() => handleAddFood(meal.name)}
              >
                <FaPlus className="mr-1" /> Add Food
              </button>
              <button className="text-[#28A745] hover:underline">Quick Tools</button>
            </div>

            {/* Empty state for each meal */}
            <div className="grid grid-cols-7 gap-2 text-center text-gray-500 text-sm">
              <div className="col-span-1"></div>
              <div className="p-2">0</div>
              <div className="p-2">0</div>
              <div className="p-2">0</div>
              <div className="p-2">0</div>
              <div className="p-2">0</div>
              <div className="p-2">0</div>
            </div>
          </div>
        ))}

        {/* Totals and Goals */}
        <div className="mt-8 border-t pt-4">
          <div className="grid grid-cols-7 gap-2 text-center font-medium">
            <div className="text-left">Totals</div>
            <div>0</div>
            <div>0</div>
            <div>0</div>
            <div>0</div>
            <div>0</div>
            <div>0</div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center font-medium mt-2">
            <div className="text-left">Your Daily Goal</div>
            <div className="text-[#28A745]">{nutritionalGoals.calories.total}</div>
            <div className="text-[#28A745]">{nutritionalGoals.carbs.total}</div>
            <div className="text-[#28A745]">{nutritionalGoals.fat.total}</div>
            <div className="text-[#28A745]">{nutritionalGoals.protein.total}</div>
            <div className="text-[#28A745]">{nutritionalGoals.sodium.total}</div>
            <div className="text-[#28A745]">{nutritionalGoals.sugar.total}</div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center font-medium mt-2">
            <div className="text-left">Remaining</div>
            <div className="text-[#28A745]">{nutritionalGoals.calories.total}</div>
            <div className="text-[#28A745]">{nutritionalGoals.carbs.total}</div>
            <div className="text-[#28A745]">{nutritionalGoals.fat.total}</div>
            <div className="text-[#28A745]">{nutritionalGoals.protein.total}</div>
            <div className="text-[#28A745]">{nutritionalGoals.sodium.total}</div>
            <div className="text-[#28A745]">{nutritionalGoals.sugar.total}</div>
          </div>
        </div>

        {/* Complete Entry Button */}
        <div className="mt-8 text-center">
          <p className="mb-4 text-gray-600">
            When you're finished logging all foods and exercise for this day, click here:
          </p>
          <button className="bg-[#28A745] hover:bg-[#218838] text-white font-medium py-2 px-6 rounded-md">
            Complete This Entry
          </button>
        </div>

        {/* Water Consumption */}
        <div className="mt-8 border-t pt-4">
          <h3 className="text-lg font-semibold text-[#004D40]">Water Consumption</h3>
          {/* Water tracking UI would go here */}
        </div>
      </div>

      {/* Add Food Modal */}
      {showAddFood && <AddFoodItem onClose={() => setShowAddFood(false)} mealType={selectedMeal} />}
    </div>
  )
}

export default FoodDiary
