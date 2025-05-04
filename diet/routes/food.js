const express = require("express")
const router = express.Router()
const verifyToken = require("../auth/verifyToken")
const Food = require("../models/foodModel")
const DiaryEntry = require("../models/diaryModel")

router.post("/", verifyToken, async (req, res) => {
  const { name, calories, protein, carbs, fats, category } = req.body
  const userId = req.user.id // Changed from req.user.userId to req.user.id
  const searchTerm = name.toLowerCase()

  try {
    console.log(`🔍 Checking if food ${name} exists for user ${userId}`)
    const existingFoods = await Food.find({ userId })
    const alreadyExists = existingFoods.some((f) => f.name.toLowerCase() === searchTerm)

    if (alreadyExists) {
      console.log(`❌ Food with name ${name} already exists for user ${userId}`)
      return res.status(409).send({ message: "Food with this name already exists." })
    }

    console.log(`✅ Adding new food: ${name}`)
    const newFood = new Food({ name, calories, protein, carbs, fats, category, userId })

    await newFood.save()
    console.log(`✅ Food ${name} added successfully`)
    res.status(201).send({ message: "Food added successfully!", food: newFood })
  } catch (err) {
    console.error("Error adding food:", err)
    res.status(500).send({ message: "Failed to add food." })
  }
})

router.get("/:name", verifyToken, async (req, res) => {
  console.log("Food route hit")
  try {
    const userId = req.user.id // Changed from req.user.userId to req.user.id
    console.log(`🔍 Fetching all foods for user ${userId}`)

    const allFoods = await Food.find({ userId })
    const searchTerm = req.params.name.toLowerCase()
    console.log(`🔍 Searching for foods matching: ${searchTerm}`)

    function fuzzyMatch(food, search) {
      const foodName = food.name.toLowerCase()
      if (foodName === search) return 1
      if (foodName.includes(search)) return 0.8

      let searchIndex = 0
      for (let i = 0; i < foodName.length && searchIndex < search.length; i++) {
        if (foodName[i] === search[searchIndex]) {
          searchIndex++
        }
      }
      if (searchIndex === search.length) return 0.6

      let matchCount = 0
      for (let i = 0; i < search.length; i++) {
        if (foodName.includes(search[i])) {
          matchCount++
        }
      }

      const matchRatio = matchCount / search.length
      if (matchRatio >= 0.5) return matchRatio * 0.5

      return 0
    }

    const results = allFoods
      .map((food) => ({
        food,
        score: fuzzyMatch(food, searchTerm),
      }))
      .filter((item) => item.score > 0.2)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.food)

    if (results.length > 0) {
      console.log(`✅ Found matching foods for "${searchTerm}"`)
      res.send(results)
    } else {
      console.log(`❌ No exact match found for "${searchTerm}"`)
      const suggestions = allFoods.filter((f) => f.name.toLowerCase().startsWith(searchTerm[0])).map((f) => f.name)

      res.status(404).send({
        message: "No exact match found.",
        suggestions: [...new Set(suggestions)].slice(0, 5),
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: "Some problem in getting the food" })
  }
})

router.post("/diary", verifyToken, async (req, res) => {
  try {
    const { foodId, date, category, quantity } = req.body
    const userId = req.user.id // Changed from req.user.userId to req.user.id
    console.log(`🔍 Adding entry to diary for user ${userId}, food ID: ${foodId}, date: ${date}`)

    const diaryEntry = await DiaryEntry.create({
      userId,
      food: foodId,
      date: new Date(date),
      category,
      quantity,
    })

    console.log(`✅ Diary entry added for user ${userId}, food ID: ${foodId}`)
    res.status(201).send({ message: "Diary updated", diaryEntry })
  } catch (err) {
    console.error("Error adding to diary:", err)
    res.status(500).send({ message: "Failed to add to diary" })
  }
})

router.get("/diary/:date", verifyToken, async (req, res) => {
  try {
    const { date } = req.params
    const userId = req.user.id // Changed from req.user.userId to req.user.id
    const targetDate = new Date(date)
    const start = new Date(targetDate.setHours(0, 0, 0, 0))
    const end = new Date(targetDate.setHours(23, 59, 59, 999))
    console.log(`🔍 Fetching diary entries for date: ${date}`)

    const entries = await DiaryEntry.find({
      userId,
      date: { $gte: start, $lte: end },
    }).populate("food")

    console.log(`✅ Found ${entries.length} diary entries for date: ${date}`)
    res.send(entries)
  } catch (err) {
    console.error("Error fetching diary entries:", err)
    res.status(500).send({ message: "Failed to fetch diary" })
  }
})

module.exports = router
