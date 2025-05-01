import React, { useState, useEffect, useContext } from 'react';
import { FaCoffee, FaUtensils, FaCarrot, FaCookieBite, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { toast } from 'react-toastify';

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
  const location = useLocation();
  const navigate = useNavigate();

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const apiDateFormat = currentDate.toISOString().split('T')[0];
  const userID = loggedUser ? loggedUser.name : null;
  const API_URL = "http://localhost:3000";

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/food/')) {
      const mealFromPath = path.split('/food/')[1];
      if (['breakfast', 'lunch', 'dinner', 'snacks'].includes(mealFromPath.toLowerCase())) {
        const capitalizedMeal = mealFromPath.charAt(0).toUpperCase() + mealFromPath.slice(1);
        setSelectedMeal(capitalizedMeal);
      }
    }
  }, [location.pathname]);
  const fetchFoodEntries = async () => {
    setLoading(true);
    setError(null);
    console.log("userID get:", userID);
  
    if (!userID) {
      setError("Missing required parameter: userID.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.get(`${API_URL}/food-diary`, {
        params: { userId: userID }
      });
  
      if (response.data.length === 0) {
        setError("No food diary entries found.");
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
        if (mealData[entry.mealType]) {
          mealData[entry.mealType].push(entry);
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
  
  
  
  // Navigate to previous day
  const goToPreviousDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setCurrentDate(prevDay);
  };

  // Navigate to next day
  const goToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setCurrentDate(nextDay);
  };

  const handleAddFood = (meal) => {
    setSelectedMeal(meal);
    setShowAddFood(true);
    
    const mealPath = meal.toLowerCase();
    navigate(`/food/${mealPath}`, { replace: true });
  };

  const handleAddFoodToDiary = async (foodItem) => {
    try {
      const diaryEntry = {
        userId: userID,
        name: foodItem.name,
        calories: foodItem.calories,
        protein: foodItem.protein || 0,
        carbs: foodItem.carbs || 0,
        fats: foodItem.fats || 0,
        mealType: foodItem.mealType,
      };
  
      const response = await axios.post(`${API_URL}/food-diary`, diaryEntry);
  
      setMeals(prevMeals => ({
        ...prevMeals,
        [foodItem.mealType]: [...prevMeals[foodItem.mealType], response.data]
      }));
  
      toast.success(`Added ${foodItem.name} to ${foodItem.mealType}`);
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
        fats: totals.fats + (item.fats || 0)
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const calculateDailyTotals = () => {
    const allFoods = [...meals.Breakfast, ...meals.Lunch, ...meals.Dinner, ...meals.Snacks];
    return calculateMealTotals(allFoods);
  };

  const mealSections = [
    { name: "Breakfast", icon: <FaCoffee className="text-[#28A745]" /> },
    { name: "Lunch", icon: <FaUtensils className="text-[#28A745]" /> },
    { name: "Dinner", icon: <FaCarrot className="text-[#28A745]" /> },
    { name: "Snacks", icon: <FaCookieBite className="text-[#28A745]" /> },
  ];

  const calculateNutritionalGoals = () => {
    if (!loggedUser) return {
      calories: { total: 2000, unit: "kcal" },
      carbs: { total: 250, unit: "g" },
      fat: { total: 70, unit: "g" },
      protein: { total: 100, unit: "g" }
    };
    
    let bmr = 0;
    const weight = loggedUser.weight; // in kg
    const height = loggedUser.height; // in cm
    const age = loggedUser.age || 30; // default to 30 if not specified
    
    if (loggedUser.gender.toLowerCase() === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    const activityMultipliers = {
      'sedentary': 1.2,
      'lightly active': 1.375,
      'moderately active': 1.55,
      'very active': 1.725,
      'extra active': 1.9
    };
    
    const multiplier = activityMultipliers[loggedUser.activityLevel.toLowerCase()] || 1.375;
    let tdee = bmr * multiplier;
    
    switch(loggedUser.goal.toLowerCase()) {
      case 'lose weight':
        tdee -= 500; // Caloric deficit
        break;
      case 'gain weight':
      case 'build muscle':
        tdee += 300; // Caloric surplus
        break;
      default: // Maintain weight
        break;
    }
    
    const protein = Math.round(weight * 1.6); // 1.6g per kg body weight
    const fat = Math.round(tdee * 0.3 / 9); // 30% of calories from fat
    const carbs = Math.round((tdee - (protein * 4) - (fat * 9)) / 4); // Remaining calories from carbs
    
    return {
      calories: { total: Math.round(tdee), unit: "kcal" },
      carbs: { total: carbs, unit: "g" },
      fat: { total: fat, unit: "g" },
      protein: { total: protein, unit: "g" }
    };
  };
  
  const nutritionalGoals = calculateNutritionalGoals();

  const dailyTotals = calculateDailyTotals();
  const remaining = {
    calories: nutritionalGoals.calories.total - dailyTotals.calories,
    carbs: nutritionalGoals.carbs.total - dailyTotals.carbs,
    fat: nutritionalGoals.fat.total - dailyTotals.fats,
    protein: nutritionalGoals.protein.total - dailyTotals.protein
  };

  useEffect(() => {
    fetchFoodEntries();
  }, [currentDate]);

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

        {loading ? (
          <div className="text-center py-4">Loading your food diary...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <>
            {/* Nutritional Headers */}
            <div className="grid grid-cols-6 gap-2 mb-2 text-center font-medium text-sm">
              <div className="col-span-2"></div>
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
            </div>

            {/* Meal Sections */}
            {mealSections.map((meal, index) => {
              const mealItems = meals[meal.name] || [];
              const mealTotals = calculateMealTotals(mealItems);
              
              return (
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

                  {/* Food Items for this meal */}
                  {mealItems.length > 0 ? (
                    <div className="mb-2">
                      {mealItems.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-6 gap-2 text-sm border-b py-2">
                          <div className="col-span-2 flex justify-between">
                            <div>
                              <div className="font-medium">{item.name}</div>
                            </div>
                            <button 
                              onClick={() => handleRemoveFood(item._id, meal.name)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="text-center">{Math.round(item.calories || 0)}</div>
                          <div className="text-center">{Math.round(item.carbs || 0)}</div>
                          <div className="text-center">{Math.round(item.fats || 0)}</div>
                          <div className="text-center">{Math.round(item.protein || 0)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-6 gap-2 text-center text-gray-500 text-sm">
                      <div className="col-span-2">No entries yet</div>
                      <div className="p-2">0</div>
                      <div className="p-2">0</div>
                      <div className="p-2">0</div>
                      <div className="p-2">0</div>
                    </div>
                  )}

                  {/* Meal totals */}
                  {mealItems.length > 0 && (
                    <div className="grid grid-cols-6 gap-2 text-center font-medium text-sm bg-gray-100 py-1">
                      <div className="col-span-2 text-right">Total {meal.name}</div>
                      <div>{Math.round(mealTotals.calories)}</div>
                      <div>{Math.round(mealTotals.carbs)}</div>
                      <div>{Math.round(mealTotals.fats)}</div>
                      <div>{Math.round(mealTotals.protein)}</div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Totals and Goals */}
            <div className="mt-8 border-t pt-4">
              <div className="grid grid-cols-6 gap-2 text-center font-medium">
                <div className="col-span-2 text-right">Daily Totals</div>
                <div>{Math.round(dailyTotals.calories)}</div>
                <div>{Math.round(dailyTotals.carbs)}</div>
                <div>{Math.round(dailyTotals.fats)}</div>
                <div>{Math.round(dailyTotals.protein)}</div>
              </div>

              <div className="grid grid-cols-6 gap-2 text-center font-medium mt-2">
                <div className="col-span-2 text-right">Your Daily Goal</div>
                <div className="text-[#28A745]">{nutritionalGoals.calories.total}</div>
                <div className="text-[#28A745]">{nutritionalGoals.carbs.total}</div>
                <div className="text-[#28A745]">{nutritionalGoals.fat.total}</div>
                <div className="text-[#28A745]">{nutritionalGoals.protein.total}</div>
              </div>

              <div className="grid grid-cols-6 gap-2 text-center font-medium mt-2">
                <div className="col-span-2 text-right">Remaining</div>
                <div className={remaining.calories < 0 ? "text-red-500" : "text-[#28A745]"}>
                  {Math.round(remaining.calories)}
                </div>
                <div className={remaining.carbs < 0 ? "text-red-500" : "text-[#28A745]"}>
                  {Math.round(remaining.carbs)}
                </div>
                <div className={remaining.fat < 0 ? "text-red-500" : "text-[#28A745]"}>
                  {Math.round(remaining.fat)}
                </div>
                <div className={remaining.protein < 0 ? "text-red-500" : "text-[#28A745]"}>
                  {Math.round(remaining.protein)}
                </div>
              </div>
            </div>

            {/* Complete Entry Button */}
            <div className="mt-8 text-center">
              <p className="mb-4 text-gray-600">
                When you're finished logging all foods and exercise for this day, click here:
              </p>
              <button 
                onClick={() => toast.success("Entry completed! Your progress has been saved.")}
                className="bg-[#28A745] hover:bg-[#218838] text-white font-medium py-2 px-6 rounded-md">
                Complete This Entry
              </button>
            </div>

            {/* Water Consumption */}
            <div className="mt-8 border-t pt-4">
              <h3 className="text-lg font-semibold text-[#004D40]">Water Consumption</h3>
              <div className="flex items-center mt-2">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((glass) => (
                    <button 
                      key={glass} 
                      onClick={() => {
                        // Here you would update water consumption in your app
                        toast.info(`${glass} glasses of water logged`);
                        navigate('/food/water', { replace: true });
                      }}
                      className="w-8 h-12 bg-blue-100 hover:bg-blue-200 rounded-md flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19V5M5 12h14"></path>
                      </svg>
                    </button>
                  ))}
                </div>
                <div className="ml-4 text-gray-600">0 / 8 glasses</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Food Modal */}
      {showAddFood && (
        <AddFoodItem 
          userId={loggedUser.name}
          onAddFood={handleAddFoodToDiary}
        />
      )}
    </div>
  );
};

export default FoodDiary;