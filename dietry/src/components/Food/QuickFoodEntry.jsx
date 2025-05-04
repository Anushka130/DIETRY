"use client"

import { useState, useEffect } from "react"
import { FaPlus, FaSearch, FaUtensils } from "react-icons/fa"
import { toast } from "react-toastify"

const QuickFoodEntry = ({ onFoodAdded }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedFood, setSelectedFood] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [mealType, setMealType] = useState("Breakfast")
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const token = JSON.parse(sessionStorage.getItem("diet-user"))?.token

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchFood()
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }, [searchTerm])

  const searchFood = async () => {
    if (!searchTerm.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/food/${encodeURIComponent(searchTerm)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setSearchResults(data)
        setShowResults(true)
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    } catch (error) {
      console.error("Error searching for food:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectFood = (food) => {
    setSelectedFood(food)
    setShowResults(false)
  }

  const handleAddFood = async () => {
    if (!selectedFood) return

    try {
      const response = await fetch("http://localhost:5000/food/diary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          foodId: selectedFood._id,
          date: new Date().toISOString(),
          category: mealType,
          quantity: Number(quantity),
        }),
      })

      if (response.ok) {
        // Set flag to refresh dashboard data
        sessionStorage.setItem("dashboard_refresh_needed", "true")

        toast.success(`Added ${selectedFood.name} to your diary!`)
        setSelectedFood(null)
        setSearchTerm("")
        setQuantity(1)

        // Notify parent component
        if (onFoodAdded) {
          onFoodAdded()
        }
      } else {
        toast.error("Failed to add food to diary")
      }
    } catch (error) {
      console.error("Error adding food to diary:", error)
      toast.error("Failed to add food to diary")
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-[#004D40] mb-4 flex items-center">
        <FaUtensils className="mr-2 text-[#28A745]" /> Quick Food Entry
      </h2>

      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a food..."
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745]"
          />
        </div>

        {/* Search Results */}
        {showResults && searchResults.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg absolute z-10 max-h-60 overflow-y-auto w-full max-w-md">
            {searchResults.map((food) => (
              <div
                key={food._id}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 flex justify-between items-center"
                onClick={() => handleSelectFood(food)}
              >
                <div>
                  <div className="font-medium">{food.name}</div>
                  <div className="text-sm text-gray-500">{food.calories} kcal</div>
                </div>
                <button className="text-[#28A745] hover:text-[#218838]">
                  <FaPlus />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Selected Food */}
        {selectedFood && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-medium">{selectedFood.name}</h3>
                <p className="text-sm text-gray-500">{selectedFood.calories} kcal per serving</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="0.25"
                  step="0.25"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meal</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745]"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">
                Total Calories: {Math.round(selectedFood.calories * quantity)} kcal
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddFood}
                className="bg-[#28A745] text-white px-4 py-2 rounded-md hover:bg-[#218838]"
              >
                Add to Diary
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuickFoodEntry
