// routes/workoutSessionRoutes.js
const express = require("express");
const router = express.Router();
const { createWorkoutSession, getWorkoutSessions } = require("../controllers/workoutSessionController");
const verifyToken = require("../verifyToken");

// Save a completed workout session
router.post("/", verifyToken, createWorkoutSession);

// Get all completed workout sessions
router.get("/", verifyToken, getWorkoutSessions);

module.exports = router;
