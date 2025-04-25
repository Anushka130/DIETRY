const mongoose = require("mongoose");
const foodModel = require("./models/foodModel");

mongoose.connect("mongodb://127.0.0.1:27017/diet")
  .then(() => {
    console.log("MongoDB connected 🟢");
    return seedFoods();
  })
  .catch((err) => {
    console.error("MongoDB connection failed 🔴", err);
  });

const dummyFoods = [
  {
    name: "Chicken Breast",
    calories: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6
  },
  {
    name: "Oatmeal",
    calories: 150,
    protein: 5,
    carbs: 27,
    fats: 3
  },
  {
    name: "Banana",
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fats: 0.3
  },
  {
    name: "Boiled Egg",
    calories: 78,
    protein: 6,
    carbs: 0.6,
    fats: 5.3
  },
  {
    name: "Grilled Salmon",
    calories: 233,
    protein: 25,
    carbs: 0,
    fats: 14
  }
];

async function seedFoods() {
  try {
    await foodModel.deleteMany(); // optional: wipe existing foods
    await foodModel.insertMany(dummyFoods);
    console.log("Dummy food data inserted ✅");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding data ❌", err);
  }
}
