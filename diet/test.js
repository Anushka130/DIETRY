const mongoose = require("mongoose");
const Food = require("./models/foodModel"); // adjust path if needed

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

    const sampleFoods = [
      { name: "Oatmeal", calories: 150, protein: 5, carbs: 25, fats: 3, category: "Breakfast", userId },
      { name: "Grilled Chicken", calories: 300, protein: 40, carbs: 0, fats: 10, category: "Lunch", userId },
      { name: "Avocado Toast", calories: 250, protein: 4, carbs: 30, fats: 12, category: "Dinner", userId },
      { name: "Protein Shake", calories: 200, protein: 25, carbs: 10, fats: 5, category: "Snacks", userId },
      { name: "Eggs and Toast", calories: 280, protein: 15, carbs: 20, fats: 12, category: "Breakfast", userId },
      { name: "Rice and Dal", calories: 350, protein: 10, carbs: 50, fats: 8, category: "Lunch", userId },
      { name: "Momo", calories: 400, protein: 20, carbs: 35, fats: 18, category: "Dinner", userId },
      { name: "Chana Chatpate", calories: 180, protein: 8, carbs: 22, fats: 7, category: "Snacks", userId },
    ];

    const result = await Food.insertMany(sampleFoods);
    console.log(`Inserted ${result.length} food items for user "${userId}" 🍱`);

    mongoose.connection.close();
  } catch (err) {
    console.error("Error populating data ❌", err);
    mongoose.connection.close();
  }
}
