const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutController");
const verifyToken = require("../verifyToken");

// All routes are protected with verifyToken
router.post("/", verifyToken, workoutController.createWorkoutPlan);
router.get("/", verifyToken, workoutController.getWorkoutPlans);
router.get("/:id", verifyToken, workoutController.getWorkoutPlanById);
router.put("/:id", verifyToken, workoutController.updateWorkoutPlan);
router.delete("/:id", verifyToken, workoutController.deleteWorkoutPlan);

module.exports = router;
