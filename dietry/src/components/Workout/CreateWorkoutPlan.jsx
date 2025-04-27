// components/Workout/CreateWorkoutPlan.jsx

import { useState } from "react";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import axiosInstance from "../../axiosInstance";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const CreateWorkoutPlan = ({ onBack }) => {
  const [exercises, setExercises] = useState([
    { name: "", sets: "", reps: "", weight: "" }
  ]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    difficulty: "",
    duration: "",
    description: "",
    frequency: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "", weight: "" }]);
  };

  const removeExercise = (index) => {
    const updated = [...exercises];
    updated.splice(index, 1);
    setExercises(updated);
  };

  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const validateExercises = () => {
    if (exercises.length === 0) return false;
    for (const ex of exercises) {
      if (!ex.name.trim() || !ex.sets || !ex.reps.trim() || !ex.weight.trim()) {
        return false;
      }
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      difficulty: formData.difficulty,
      duration: formData.duration,
      frequency: formData.frequency || "3x per week",
      exercises: exercises.map((ex) => ({
        name: ex.name,
        sets: Number(ex.sets),
        reps: ex.reps,
        weight: ex.weight,
      })),
    };
  
    console.log("Submitting payload:", payload);
  
    try {
      await axiosInstance.post("/workouts", payload);  // ✅ only payload, no userId
      toast.success("Workout Plan Created Successfully!");
      onBack();
    } catch (error) {
      console.error("Error creating workout plan:", error);
  
      if (error.response) {
        console.error("Backend error response:", error.response.data);
        toast.error(error.response.data.message || "Failed to create workout plan!");
      } else {
        toast.error("Failed to create workout plan!");
      }
    }
  };
  
  
  
  

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Workout Plans
      </button>

      <h1 className="text-2xl font-bold text-[#004D40] mb-6">Create New Workout Plan</h1>

      <form onSubmit={handleSubmit}>
        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Plan Name"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <select
            id="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select Category</option>
            <option value="Strength">Strength</option>
            <option value="Cardio">Cardio</option>
            <option value="Hypertrophy">Hypertrophy</option>
            <option value="Flexibility">Flexibility</option>
            <option value="Endurance">Endurance</option>
          </select>

          <select
            id="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select Difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <input
            type="text"
            id="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Duration (e.g., 45 min)"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />

          <input
            type="text"
            id="frequency"
            value={formData.frequency}
            onChange={handleChange}
            placeholder="Frequency (e.g., 3x per week)"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />

          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your workout plan..."
            className="w-full md:col-span-2 p-2 border border-gray-300 rounded-lg min-h-[100px]"
            required
          ></textarea>
        </div>

        {/* Exercises Section */}
        <h2 className="text-xl font-bold text-[#004D40] mb-4">Exercises</h2>
        {exercises.map((exercise, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              placeholder="Exercise Name"
              value={exercise.name}
              onChange={(e) => updateExercise(index, "name", e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Sets"
              value={exercise.sets}
              onChange={(e) => updateExercise(index, "sets", e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Reps"
              value={exercise.reps}
              onChange={(e) => updateExercise(index, "reps", e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Weight"
              value={exercise.weight}
              onChange={(e) => updateExercise(index, "weight", e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => removeExercise(index)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addExercise}
          className="flex items-center gap-2 text-[#28A745] hover:text-[#218838] mb-6"
        >
          <FaPlus /> Add Exercise
        </button>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onBack}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#28A745] text-white px-4 py-2 rounded-lg hover:bg-[#218838] transition-colors"
          >
            Create Workout Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateWorkoutPlan;
