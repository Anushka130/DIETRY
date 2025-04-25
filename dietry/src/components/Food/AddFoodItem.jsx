"use client"

import { useState, useEffect } from "react"
import { FaSearch, FaTimes, FaPlus } from "react-icons/fa"
import axios from "axios"

const AddFoodItem = ({ onClose, mealType }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newFood, setNewFood] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: ""
  })

  const API_URL = "http://localhost:3000"

  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (searchTerm.trim() === "") {
      setSearchResults([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const token = getToken()
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(`${API_URL}/foods/${searchTerm}`, config)
      setSearchResults(response.data)
    } catch (err) {
      console.error("Error searching for foods:", err)
      setError(err.response?.data?.message || "Failed to search for foods")
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddFood = (food) => {
    console.log(`Adding ${food.name} to ${mealType}`)
    onClose()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewFood({
      ...newFood,
      [name]: name === "name" ? value : value === "" ? "" : Number(value)
    })
  }

  const handleAddNewFood = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const token = getToken()
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(`${API_URL}/add-food`, newFood, config)
      console.log("Food added successfully:", response.data)
      
      setSearchResults([response.data.food, ...searchResults])
      
      setNewFood({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: ""
      })
      setShowAddForm(false)
    } catch (err) {
      console.error("Error adding new food:", err)
      setError(err.response?.data?.message || "Failed to add new food")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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

        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center text-[#28A745] hover:text-[#218838] font-medium"
          >
            <FaPlus className="mr-1" />
            {showAddForm ? "Cancel" : "Add New Food"}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddNewFood} className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Food Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Name*</label>
                <input
                  type="text"
                  name="name"
                  value={newFood.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#28A745]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calories (kcal)*</label>
                <input
                  type="number"
                  name="calories"
                  value={newFood.calories}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#28A745]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                <input
                  type="number"
                  name="protein"
                  value={newFood.protein}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#28A745]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  name="carbs"
                  value={newFood.carbs}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#28A745]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fats (g)</label>
                <input
                  type="number"
                  name="fats"
                  value={newFood.fats}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#28A745]"
                />
              </div>
              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full bg-[#28A745] hover:bg-[#218838] text-white font-medium py-2 px-4 rounded"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Food"}
                </button>
              </div>
            </div>
          </form>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-[#28A745] border-r-[#28A745] border-b-transparent border-l-transparent"></div>
            <p className="mt-2 text-gray-500">Loading...</p>
          </div>
        )}

        {!loading && searchResults.length > 0 ? (
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
                    Protein
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carbs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchResults.map((food, index) => (
                  <tr key={food._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{food.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{food.calories} kcal</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{food.protein || 0} g</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{food.carbs || 0} g</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{food.fats || 0} g</div>
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
          !loading && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No foods found. Try a different search term or add a new food." : "Search for foods to add to your diary."}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default AddFoodItem