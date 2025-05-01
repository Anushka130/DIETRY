// components/Workout/Workout.jsx
import { useEffect, useState } from "react";
import WorkoutPlanList from "./WorkoutPlanList";
import WorkoutPlanDetail from "./WorkoutPlanDetail";
import CreateWorkoutPlan from './CreateWorkoutPlan'; 
import axiosInstance from "../../axiosInstance"; // import your axiosInstance

const Workout = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [workoutPlans, setWorkoutPlans] = useState([]); // initially empty

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  const fetchWorkoutPlans = async () => {
    try {
      const response = await axiosInstance.get("/workouts");
      setWorkoutPlans(response.data);
    } catch (error) {
      console.error("Error fetching workout plans:", error);
    }
  };

  const handleBackToList = () => {
    setSelectedPlan(null);
    setShowCreatePlan(false);
    fetchWorkoutPlans(); // re-fetch after creating new plan
  };

  const handleCreatePlan = () => {
    setShowCreatePlan(true);
    setSelectedPlan(null);
  };

  if (selectedPlan) {
    const plan = workoutPlans.find((p) => p._id === selectedPlan);
    if (plan) {
      return <WorkoutPlanDetail plan={plan} onBack={handleBackToList} />;
    }
  }

  if (showCreatePlan) {
    return <CreateWorkoutPlan onBack={handleBackToList} />;
  }

  return (
    <WorkoutPlanList
      plans={workoutPlans}
      onSelectPlan={(id) => setSelectedPlan(id)}
      onCreatePlan={handleCreatePlan}
    />
  );
};

export default Workout;
