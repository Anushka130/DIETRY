const mongoose = require("mongoose");
const Food = require("./models/foodModel"); // Adjust the path as needed
const FoodDiary = require("./models/foodDiaryModel"); // Adjust the path as needed

mongoose.connect("mongodb://127.0.0.1:27017/diet")
  .then(async () => {
    console.log("MongoDB connected 🟢");
    await populateData();
  })
  .catch((err) => {
    console.error("MongoDB connection failed 🔴", err);
  });

async function populateData() {
  try {
    const userId = "patlu";
    const date = "2025/05/02";

    // Define some sample foods to insert into the Food collection
    const sampleFoods = [
      { name: "Oatmeal", calories: 150, protein: 5, carbs: 25, fats: 3, category: "Breakfast", userId },
      { name: "Grilled Chicken", calories: 300, protein: 40, carbs: 0, fats: 10, category: "Lunch", userId },
      { name: "Avocado Toast", calories: 250, protein: 4, carbs: 30, fats: 12, category: "Dinner", userId },
      { name: "Protein Shake", calories: 200, protein: 25, carbs: 10, fats: 5, category: "Snacks", userId },
    ];

    // Insert the foods into the Food collection
    const foodEntries = await Food.insertMany(sampleFoods);
    console.log(`Inserted ${foodEntries.length} food items 🚀`);

    // For each food item, create a corresponding food diary entry
    const foodDiaryEntries = foodEntries.map(food => ({
      userId: food.userId,
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
      mealType: food.category,
      date,
    }));

    // Insert the food diary entries into the FoodDiary collection
    const diaryEntries = await FoodDiary.insertMany(foodDiaryEntries);
    console.log(`Inserted ${diaryEntries.length} food diary entries 📅`);

    // Close the MongoDB connection
    mongoose.connection.close();
  } catch (err) {
    console.error("Error populating data ❌", err);
    mongoose.connection.close();
  }
}
