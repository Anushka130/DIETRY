import React, { useState, useEffect, useContext } from 'react';
import { FaCoffee, FaUtensils, FaCarrot, FaCookieBite, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';
import { toast } from 'react-toastify';
import AddFoodItem from './AddFoodItem';

const FoodDiary = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState("");
  const [meals, setMeals] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { loggedUser } = useContext(UserContext);
  const API_URL = "http://localhost:5000";
  const token = loggedUser?.token || JSON.parse(sessionStorage.getItem("diet-user"))?.token;

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dateString = currentDate.toISOString().split('T')[0];

  useEffect(() => {
    fetchFoodEntries();
  }, [currentDate, loggedUser]);

  const fetchFoodEntries = async () => {
    if (!loggedUser) {
      setError("Please log in to view your food diary.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/food/diary/${dateString}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data.length === 0) {
        setMeals({
          Breakfast: [],
          Lunch: [],
          Dinner: [],
          Snacks: []
        });
        return;
      }
  
      const mealData = {
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        Snacks: []
      };
  
      response.data.forEach(entry => {
        if (mealData[entry.category]) {
          const foodItem = {
            _id: entry.food._id,
            name: entry.food.name,
            calories: entry.food.calories * entry.quantity,
            protein: entry.food.protein * entry.quantity,
            carbs: entry.food.carbs * entry.quantity,
            fats: entry.food.fats * entry.quantity,
            quantity: entry.quantity
          };
          mealData[entry.category].push(foodItem);
        }
      });
  
      setMeals(mealData);
    } catch (err) {
      console.error("Error fetching food diary:", err);
      setError(err.response?.data?.message || "Failed to load food diary");
    } finally {
      setLoading(false);
    }
  };
  
  const goToPreviousDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setCurrentDate(prevDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setCurrentDate(nextDay);
  };

  const handleAddFood = (meal) => {
    setSelectedMeal(meal);
    setShowAddFood(true);
  };

  const handleAddFoodToDiary = async (foodItem) => {
    try {
      await axios.post(`${API_URL}/food/diary`, {
        foodId: foodItem._id,
        date: dateString,
        category: selectedMeal,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setMeals(prevMeals => {
        const updatedMeals = {...prevMeals};
        const newFood = {
          _id: foodItem._id,
          name: foodItem.name,
          calories: foodItem.calories,
          protein: foodItem.protein || 0,
          carbs: foodItem.carbs || 0,
          fats: foodItem.fats || 0,
          quantity: 1
        };
        updatedMeals[selectedMeal] = [...updatedMeals[selectedMeal], newFood];
        return updatedMeals;
      });
  
      toast.success(`Added ${foodItem.name} to ${selectedMeal}`);
      
      setShowAddFood(false);
    } catch (err) {
      console.error("Error adding food to diary:", err);
      setError(err.response?.data?.message || "Failed to add food to diary");
      toast.error("Failed to add food to diary");
    }
  };

  const calculateMealTotals = (mealItems) => {
    return mealItems.reduce((totals, item) => {
      return {
        calories: totals.calories + (item.calories || 0),
        protein: totals.protein + (item.protein || 0),
        carbs: totals.carbs + (item.carbs || 0),
        fats: totals.fats + (item.fats || 0),
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const calculateDailyTotals = () => {
    const allFoods = [...meals.Breakfast, ...meals.Lunch, ...meals.Dinner, ...meals.Snacks];
    return calculateMealTotals(allFoods);
  };

  const mealSections = [
    { name: "Breakfast", icon: <FaCoffee className="text-green-600" /> },
    { name: "Lunch", icon: <FaUtensils className="text-green-600" /> },
    { name: "Dinner", icon: <FaCarrot className="text-green-600" /> },
    { name: "Snacks", icon: <FaCookieBite className="text-green-600" /> },
  ];

  const dailyTotals = calculateDailyTotals();

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h1 className="text-xl font-bold text-teal-800 mb-4">Food Diary</h1>

        <div className="flex justify-between items-center mb-6">
          <button onClick={goToPreviousDay} className="text-teal-600 hover:text-teal-800">
            <FaChevronLeft />
          </button>
          <h2 className="text-lg font-medium">{formattedDate}</h2>
          <button onClick={goToNextDay} className="text-teal-600 hover:text-teal-800">
            <FaChevronRight />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-2 mb-4 text-center font-medium text-sm bg-gray-100 p-2 rounded">
              <div className="col-span-4">Daily Summary</div>
              <div className="col-span-2">Calories</div>
              <div className="col-span-2">Protein</div>
              <div className="col-span-2">Carbs</div>
              <div className="col-span-2">Fats</div>
            </div>
            
            <div className="grid grid-cols-12 gap-2 mb-4 text-center text-sm border-b pb-2">
              <div className="col-span-4 font-medium">Total</div>
              <div className="col-span-2">{Math.round(dailyTotals.calories)} kcal</div>
              <div className="col-span-2">{Math.round(dailyTotals.protein || 0)} g</div>
              <div className="col-span-2">{Math.round(dailyTotals.carbs || 0)} g</div>
              <div className="col-span-2">{Math.round(dailyTotals.fats || 0)} g</div>
            </div>

            {mealSections.map((meal, index) => {
              const mealItems = meals[meal.name] || [];
              const mealTotals = calculateMealTotals(mealItems);
              
              return (
                <div key={index} className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="mr-2">{meal.icon}</div>
                      <h2 className="text-lg font-semibold text-teal-800">{meal.name}</h2>
                    </div>
                    <button
                      className="flex items-center text-green-600 hover:text-green-800"
                      onClick={() => handleAddFood(meal.name)}
                    >
                      <FaPlus className="mr-1" /> Add Food
                    </button>
                  </div>

                  {mealItems.length > 0 ? (
                    <div className="mb-2">
                      <div className="grid grid-cols-12 gap-2 text-sm font-medium border-b py-1 bg-gray-50">
                        <div className="col-span-4">Food</div>
                        <div className="col-span-2 text-center">Calories</div>
                        <div className="col-span-2 text-center">Protein</div>
                        <div className="col-span-2 text-center">Carbs</div>
                        <div className="col-span-2 text-center">Fats</div>
                      </div>
                      {mealItems.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2 text-sm border-b py-2">
                          <div className="col-span-4">{item.name}</div>
                          <div className="col-span-2 text-center">{Math.round(item.calories || 0)}</div>
                          <div className="col-span-2 text-center">{Math.round(item.protein || 0)} g</div>
                          <div className="col-span-2 text-center">{Math.round(item.carbs || 0)} g</div>
                          <div className="col-span-2 text-center">{Math.round(item.fats || 0)} g</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 text-sm py-4 bg-gray-50 rounded">
                      No entries yet for {meal.name}
                    </div>
                  )}

                  {mealItems.length > 0 && (
                    <div className="grid grid-cols-12 gap-2 text-center font-medium text-sm bg-gray-100 py-1 rounded">
                      <div className="col-span-4 text-right">Total {meal.name}</div>
                      <div className="col-span-2">{Math.round(mealTotals.calories)} kcal</div>
                      <div className="col-span-2">{Math.round(mealTotals.protein)} g</div>
                      <div className="col-span-2">{Math.round(mealTotals.carbs)} g</div>
                      <div className="col-span-2">{Math.round(mealTotals.fats)} g</div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="mt-6 text-center">
              <button 
                onClick={() => toast.success("Food diary updated successfully!")}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md">
                Complete Entry
              </button>
            </div>
          </>
        )}
      </div>

      {showAddFood && (
        <AddFoodItem 
          mealType={selectedMeal}
          onAddFood={handleAddFoodToDiary}
          onClose={() => setShowAddFood(false)}
        />
      )}
    </div>
  );
};

export default FoodDiary;