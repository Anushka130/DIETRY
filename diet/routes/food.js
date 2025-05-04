const express = require("express")
const router = express.Router()
const verifyToken = require("../auth/verifyToken")
const Food = require("../models/foodModel")
const DiaryEntry = require("../models/diaryModel")

router.post("/", verifyToken, async (req, res) => {
  const { name, calories, protein, carbs, fats, category } = req.body
  const userId = req.user.id
  const searchTerm = name.toLowerCase()

  try {
    console.log(`🔍 Checking if food ${name} exists globally`)
    // Check if food exists globally first
    const existingFood = await Food.findOne({
      name: { $regex: new RegExp(`^${searchTerm}$`, "i") },
      isGlobal: true,
    })

    if (existingFood) {
      console.log(`❌ Food with name ${name} already exists globally`)
      return res.status(409).send({ message: "Food with this name already exists." })
    }

    console.log(`✅ Adding new food: ${name}`)
    const newFood = new Food({
      name,
      calories,
      protein,
      carbs,
      fats,
      category,
      userId,
      isGlobal: true, // Make all new foods global by default
    })

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
    console.log(`🔍 Fetching all foods matching: ${req.params.name}`)
    const searchTerm = req.params.name.toLowerCase()

    // Search for all foods (global and user-specific)
    const allFoods = await Food.find({
      $or: [{ isGlobal: true }, { userId: req.user.id }],
    })

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
    const userId = req.user.id
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
    const userId = req.user.id
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

router.delete("/diary/:entryId", verifyToken, async (req, res) => {
  try {
    const { entryId } = req.params
    const userId = req.user.id

    console.log(`🔍 Attempting to delete diary entry ${entryId} for user ${userId}`)

    // Find the diary entry and verify it belongs to the user
    const diaryEntry = await DiaryEntry.findById(entryId)

    if (!diaryEntry) {
      console.log(`❌ Diary entry ${entryId} not found`)
      return res.status(404).send({ message: "Diary entry not found" })
    }

    // Verify the entry belongs to the requesting user
    if (diaryEntry.userId.toString() !== userId) {
      console.log(`❌ User ${userId} not authorized to delete entry ${entryId}`)
      return res.status(403).send({ message: "Not authorized to delete this entry" })
    }

    // Delete the entry
    await DiaryEntry.findByIdAndDelete(entryId)
    console.log(`✅ Deleted diary entry ${entryId} for user ${userId}`)

    res.status(200).send({
      message: "Diary entry deleted successfully",
      deletedEntryId: entryId,
    })
  } catch (err) {
    console.error("Error deleting diary entry:", err)
    res.status(500).send({ message: "Failed to delete diary entry" })
  }
})

// New route to get all global foods
router.get("/", verifyToken, async (req, res) => {
  try {
    console.log(`🔍 Fetching all global foods`)
    const foods = await Food.find({ isGlobal: true })
    console.log(`✅ Found ${foods.length} global foods`)
    res.status(200).send(foods)
  } catch (err) {
    console.error("Error fetching global foods:", err)
    res.status(500).send({ message: "Failed to fetch global foods" })
  }
})

module.exports = router
