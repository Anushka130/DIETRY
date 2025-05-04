const express = require("express")
const router = express.Router()
const { getDailySummary, getDateRangeSummary } = require("../controllers/calorieSummaryController")
const verifyToken = require("../auth/verifyToken")

// Get calorie summary for a specific date
router.get("/daily/:date", verifyToken, getDailySummary)

// Get calorie summary for a date range
router.get("/range", verifyToken, getDateRangeSummary)

module.exports = router
