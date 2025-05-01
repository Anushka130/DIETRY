"use client"

import { useState } from "react"
import { FaSearch, FaTimes } from "react-icons/fa"

const AddFoodItem = ({ onClose, mealType }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])

  // Mock food database
  const foodDatabase = [
    { name: "Apple", calories: 95, carbs: 25, fat: 0.3, protein: 0.5, sodium: 2, sugar: 19 },
    { name: "Banana", calories: 105, carbs: 27, fat: 0.4, protein: 1.3, sodium: 1, sugar: 14 },
    { name: "Chicken Breast", calories: 165, carbs: 0, fat: 3.6, protein: 31, sodium: 74, sugar: 0 },
    { name: "Brown Rice", calories: 216, carbs: 45, fat: 1.8, protein: 5, sodium: 10, sugar: 0.7 },
    { name: "Salmon", calories: 206, carbs: 0, fat: 12, protein: 22, sodium: 59, sugar: 0 },
    { name: "Broccoli", calories: 55, carbs: 11, fat: 0.6, protein: 3.7, sodium: 33, sugar: 2.6 },
    { name: "Greek Yogurt", calories: 100, carbs: 3.6, fat: 0.4, protein: 17, sodium: 36, sugar: 3.6 },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim() === "") {
      setSearchResults([])
      return
    }

    const results = foodDatabase.filter((food) => food.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setSearchResults(results)
  }

  const handleAddFood = (food) => {
    // In a real app, this would add the food to the user's diary
    console.log(`Adding ${food.name} to ${mealType}`)
    // Close the modal after adding
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#004D40]">Add Food to {mealType}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search for a food..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#28A745] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              type="submit"
              className="bg-[#28A745] hover:bg-[#218838] text-white font-medium py-2 px-6 rounded-r-lg"
            >
              Search
            </button>
          </div>
        </form>

        {searchResults.length > 0 ? (
          <div className="overflow-y-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Food
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Calories
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchResults.map((food, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{food.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{food.calories} kcal</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleAddFood(food)}
                        className="text-[#28A745] hover:text-[#218838] font-medium"
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "No foods found. Try a different search term." : "Search for foods to add to your diary."}
          </div>
        )}
      </div>
    </div>
  )
}

export default AddFoodItem
