// components/Workout/Workout.jsx
import { useState } from "react"
import WorkoutPlanList from "./WorkoutPlanList"
import WorkoutPlanDetail from "./WorkoutPlanDetail"
import CreateWorkoutPlan from './CreateWorkoutPlan'; 
// Adjust the import based on your project structure

const Workout = () => {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showCreatePlan, setShowCreatePlan] = useState(false)

  // Sample workout plans data
  const workoutPlans = [
    {
      id: "1",
      name: "Strength Builder",
      description: "Focus on building strength with compound movements",
      category: "Strength",
      difficulty: "Intermediate",
      duration: "45 min",
      frequency: "3x per week",
      progress: 65,
      exercises: [
        { name: "Barbell Squat", sets: 4, reps: "8-10", weight: "13lbs" },
        { name: "Bench Press", sets: 4, reps: "8-10", weight: "115 lbs" },
        { name: "Deadlift", sets: 3, reps: "6-8", weight: "185 lbs" },
        { name: "Overhead Press", sets: 3, reps: "8-10", weight: "65 lbs" },
        { name: "Pull-ups", sets: 3, reps: "8-10", weight: "Bodyweight" },
      ],
    },
    {
      id: "2",
      name: "HIIT Cardio",
      description: "High intensity interval training for fat loss",
      category: "Cardio",
      difficulty: "Advanced",
      duration: "30 min",
      frequency: "2x per week",
      progress: 40,
      exercises: [
        { name: "Burpees", sets: 3, reps: "45 sec", weight: "Bodyweight" },
        { name: "Mountain Climbers", sets: 3, reps: "45 sec", weight: "Bodyweight" },
        { name: "Jump Squats", sets: 3, reps: "45 sec", weight: "Bodyweight" },
        { name: "Kettlebell Swings", sets: 3, reps: "45 sec", weight: "35 lbs" },
        { name: "Rest", sets: 3, reps: "15 sec", weight: "-" },
      ],
    },
    {
      id: "3",
      name: "Full Body Toning",
      description: "Complete body workout focusing on muscle definition",
      category: "Hypertrophy",
      difficulty: "Beginner",
      duration: "50 min",
      frequency: "3x per week",
      progress: 80,
      exercises: [
        { name: "Dumbbell Lunges", sets: 3, reps: "12 each leg", weight: "20 lbs" },
        { name: "Push-ups", sets: 3, reps: "12-15", weight: "Bodyweight" },
        { name: "Dumbbell Rows", sets: 3, reps: "12 each arm", weight: "25 lbs" },
        { name: "Lateral Raises", sets: 3, reps: "12-15", weight: "10 lbs" },
        { name: "Plank", sets: 3, reps: "45 sec", weight: "Bodyweight" },
      ],
    },
  ]

  const handleBackToList = () => {
    setSelectedPlan(null)
    setShowCreatePlan(false)
  }

  const handleCreatePlan = () => {
    setShowCreatePlan(true)
    setSelectedPlan(null)
  }

  if (selectedPlan) {
    const plan = workoutPlans.find((p) => p.id === selectedPlan)
    if (plan) {
      return <WorkoutPlanDetail plan={plan} onBack={handleBackToList} />
    }
  }

  if (showCreatePlan) {
    return <CreateWorkoutPlan onBack={handleBackToList} />
  }

  return <WorkoutPlanList plans={workoutPlans} onSelectPlan={setSelectedPlan} onCreatePlan={handleCreatePlan} />
}

export default Workout