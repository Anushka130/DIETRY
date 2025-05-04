"use client"

import { useState, useEffect } from "react"
import { FaPlus } from "react-icons/fa"
import axios from "axios"

const AddFoodItem = ({ onClose, mealType, onAddFood }) => {
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
    fats: "",
    category: mealType || "Breakfast",
  })

  const API_URL = "http://localhost:5000"
  const token = JSON.parse(sessionStorage.getItem("diet-user"))?.token

  const foodCategories = ["Breakfast", "Lunch", "Dinner", "Snacks"]

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return setSearchResults([])

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`${API_URL}/food/${encodeURIComponent(searchTerm)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setSearchResults(response.data)
    } catch (err) {
      if (err.response && err.response.data && err.response.data.suggestions) {
        setError(`No exact match found. Did you mean: ${err.response.data.suggestions.join(", ")}?`)
      } else {
        setError("Failed to search for foods")
      }
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddFood = (food) => {
    onAddFood({ ...food, mealType })
    onClose()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewFood((prev) => ({
      ...prev,
      [name]: name === "name" || name === "category" ? value : value === "" ? "" : Number(value),
    }))
  }

  const handleAddNewFood = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(
        `${API_URL}/food`,
        {
          name: newFood.name,
          calories: newFood.calories,
          protein: newFood.protein,
          carbs: newFood.carbs,
          fats: newFood.fats,
          category: newFood.category,
          isGlobal: true, // Make all new foods global by default
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setSearchResults([response.data.food, ...searchResults])
      setNewFood({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
        category: mealType || "Breakfast",
      })
      setShowAddForm(false)
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("Food with this name already exists.")
      } else {
        setError("Failed to add new food")
      }
    } finally {
      setLoading(false)
    }
  }

  const addFoodToDiary = async (food) => {
    try {
      handleAddFood(food)
    } catch (err) {
      setError("Failed to add food to diary")
    }
  }

  useEffect(() => {
    setNewFood((prev) => ({
      ...prev,
      category: mealType || "Breakfast",
    }))
  }, [mealType])

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#004D40]">Add Food to {mealType}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <form onSubmit={handleSearch} className="mb-4 flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search food..."
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none"
          />
          <button type="submit" className="bg-[#004D40] text-white px-4 py-2 rounded-r-md" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button onClick={() => setShowAddForm(!showAddForm)} className="text-[#28A745] flex items-center">
          <FaPlus className="mr-1" /> {showAddForm ? "Cancel" : "Add new food"}
        </button>

        {showAddForm && (
          <form onSubmit={handleAddNewFood} className="mt-4">
            <input
              type="text"
              name="name"
              value={newFood.name}
              onChange={handleInputChange}
              placeholder="Food Name"
              className="w-full p-2 mb-2 border border-gray-300"
              required
            />
            <input
              type="number"
              name="calories"
              value={newFood.calories}
              onChange={handleInputChange}
              placeholder="Calories"
              className="w-full p-2 mb-2 border border-gray-300"
              required
            />
            <input
              type="number"
              name="protein"
              value={newFood.protein}
              onChange={handleInputChange}
              placeholder="Protein (g)"
              className="w-full p-2 mb-2 border border-gray-300"
            />
            <input
              type="number"
              name="carbs"
              value={newFood.carbs}
              onChange={handleInputChange}
              placeholder="Carbs (g)"
              className="w-full p-2 mb-2 border border-gray-300"
            />
            <input
              type="number"
              name="fats"
              value={newFood.fats}
              onChange={handleInputChange}
              placeholder="Fats (g)"
              className="w-full p-2 mb-2 border border-gray-300"
            />
            <select
              name="category"
              value={newFood.category}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border border-gray-300"
            >
              {foodCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button type="submit" className="w-full bg-[#28A745] text-white py-2 mt-2 rounded-md" disabled={loading}>
              {loading ? "Adding..." : "Add Food"}
            </button>
          </form>
        )}

        <div className="mt-4 max-h-60 overflow-y-auto">
          {searchResults.length ? (
            <ul className="divide-y divide-gray-200">
              {searchResults.map((food) => (
                <li key={food._id} className="py-2 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{food.name}</h4>
                    <p className="text-sm text-gray-500">{food.calories} kcal</p>
                    <p className="text-xs text-gray-400">
                      P: {food.protein}g | C: {food.carbs}g | F: {food.fats}g
                    </p>
                  </div>
                  <button
                    onClick={() => addFoodToDiary(food)}
                    className="bg-[#28A745] text-white px-3 py-1 text-sm rounded-md"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            !loading && searchTerm && <p className="text-center text-gray-500">No foods found</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddFoodItem
