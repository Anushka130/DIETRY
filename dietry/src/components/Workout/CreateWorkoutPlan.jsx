// components/Workout/CreateWorkoutPlan.jsx
import { useState } from "react"
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa"

const CreateWorkoutPlan = ({ onBack }) => {
  const [exercises, setExercises] = useState([{ name: "", sets: "", reps: "", weight: "" }])

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "", weight: "" }])
  }

  const removeExercise = (index) => {
    const updatedExercises = [...exercises]
    updatedExercises.splice(index, 1)
    setExercises(updatedExercises)
  }

  const updateExercise = (index, field, value) => {
    const updatedExercises = [...exercises]
    updatedExercises[index] = { ...updatedExercises[index], [field]: value }
    setExercises(updatedExercises)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically save the workout plan to your backend
    onBack()
  }

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="plan-name" className="block text-gray-700 font-medium mb-2">
              Plan Name
            </label>
            <input
              type="text"
              id="plan-name"
              placeholder="e.g., Full Body Strength"
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select category</option>
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="hypertrophy">Hypertrophy</option>
              <option value="flexibility">Flexibility</option>
              <option value="endurance">Endurance</option>
            </select>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-gray-700 font-medium mb-2">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select difficulty</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label htmlFor="duration" className="block text-gray-700 font-medium mb-2">
              Duration
            </label>
            <input
              type="text"
              id="duration"
              placeholder="e.g., 45 min"
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Describe your workout plan..."
              className="w-full p-2 border border-gray-300 rounded-lg min-h-[100px]"
              required
            ></textarea>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#004D40] mb-4">Exercises</h2>
          
          <div className="space-y-6">
            {exercises.map((exercise, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end pb-4 border-b border-gray-200"
              >
                <div className="md:col-span-2">
                  <label htmlFor={`exercise-name-${index}`} className="block text-gray-700 text-sm font-medium mb-2">
                    Exercise Name
                  </label>
                  <input
                    id={`exercise-name-${index}`}
                    value={exercise.name}
                    onChange={(e) => updateExercise(index, "name", e.target.value)}
                    placeholder="e.g., Bench Press"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`sets-${index}`} className="block text-gray-700 text-sm font-medium mb-2">
                    Sets
                  </label>
                  <input
                    id={`sets-${index}`}
                    value={exercise.sets}
                    onChange={(e) => updateExercise(index, "sets", e.target.value)}
                    placeholder="e.g., 3"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`reps-${index}`} className="block text-gray-700 text-sm font-medium mb-2">
                    Reps
                  </label>
                  <input
                    id={`reps-${index}`}
                    value={exercise.reps}
                    onChange={(e) => updateExercise(index, "reps", e.target.value)}
                    placeholder="e.g., 8-12"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    disabled={exercises.length === 1}
                    className={`p-2 rounded-lg ${
                      exercises.length === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-500 hover:bg-red-50"
                    }`}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addExercise}
              className="w-full border border-dashed border-gray-300 text-gray-600 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <FaPlus /> Add Exercise
            </button>
          </div>
        </div>

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
  )
}

export default CreateWorkoutPlan