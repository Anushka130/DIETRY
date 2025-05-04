const express = require("express")
const router = express.Router()
const { createActivity, getActivities } = require("../controllers/activityController")
const verifyToken = require("../auth/verifyToken") // Changed from "../verifyToken" to "../auth/verifyToken"

router.post("/", verifyToken, createActivity)
router.get("/", verifyToken, getActivities)

module.exports = router
