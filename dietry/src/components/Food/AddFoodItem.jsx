"use client"

import { useState, useEffect } from "react"
import { FaSearch, FaTimes, FaPlus } from "react-icons/fa"
import axios from "axios"

const AddFoodItem = ({ onClose, mealType, onAddFood }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFood, setNewFood] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    category: mealType || "Breakfast" // Default to current mealType or Breakfast
  });

  const API_URL = "http://localhost:3000";

  const foodCategories = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.get(
        `${API_URL}/foods?userId=${userId}&q=${encodeURIComponent(searchTerm)}`
      );
  
      setSearchResults(response.data);
    } catch (err) {
      console.error("Error searching for foods:", err);
      setError(err.response?.data?.message || "Failed to search for foods");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = (food) => {
    console.log(`Adding ${food.name} to ${mealType}`);
    
    const foodToAdd = {
      ...food,
      mealType: mealType,
      date: new Date().toISOString().split('T')[0]
    };
    
    onAddFood(foodToAdd);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFood({
      ...newFood,
      [name]: name === "name" || name === "category" ? value : value === "" ? "" : Number(value)
    });
  };
  const handleAddNewFood = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.post(`${API_URL}/add-food`, {
        ...newFood,
        userId // include it in the body
      });
  
      console.log("Food added successfully:", response.data);
      setSearchResults([response.data.food, ...searchResults]);
  
      setNewFood({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
        category: mealType || "Breakfast"
      });
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding new food:", err);
      setError(err.response?.data?.message || "Failed to add new food");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setNewFood(prev => ({
      ...prev,
      category: mealType || "Breakfast"
    }));
  }, [mealType]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#004D40]">Add Food to {mealType}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for food..."
              className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#004D40]"
            />
            <button
              type="submit"
              className="bg-[#004D40] text-white px-4 py-2 rounded-r-md hover:bg-[#00695C]"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </form>

        {/* Toggle Add New Food Form */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-[#28A745] hover:underline mb-4 flex items-center"
        >
          <FaPlus className="mr-1" /> {showAddForm ? "Cancel" : "Can't find it? Add new food"}
        </button>

        {/* Add New Food Form */}
        {showAddForm && (
          <form onSubmit={handleAddNewFood} className="mb-4 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Add New Food</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Food Name</label>
                <input
                  type="text"
                  name="name"
                  value={newFood.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Calories</label>
                <input
                  type="number"
                  name="calories"
                  value={newFood.calories}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Protein (g)</label>
                <input
                  type="number"
                  name="protein"
                  value={newFood.protein}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Carbs (g)</label>
                <input
                  type="number"
                  name="carbs"
                  value={newFood.carbs}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fats (g)</label>
                <input
                  type="number"
                  name="fats"
                  value={newFood.fats}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={newFood.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {foodCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-[#28A745] text-white px-4 py-2 rounded-md hover:bg-[#218838] w-full"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Food"}
            </button>
          </form>
        )}

        {/* Search Results */}
        <div className="max-h-60 overflow-y-auto">
          {searchResults.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {searchResults.map((food) => (
                <li key={food._id} className="py-2">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{food.name}</h4>
                      <p className="text-sm text-gray-500">{food.calories} kcal</p>
                    </div>
                    <button
                      onClick={() => handleAddFood(food)}
                      className="bg-[#28A745] text-white px-3 py-1 rounded-md hover:bg-[#218838] text-sm"
                    >
                      Add
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            !loading && searchTerm && <p className="text-center text-gray-500">No foods found</p>
          )}
        </div>
      </div>
    </div>
  );
};