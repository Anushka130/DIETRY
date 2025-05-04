"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaDumbbell,
  FaEdit,
  FaPlay,
  FaTrash,
  FaPlus,
} from "react-icons/fa"
import axiosInstance from "../../axiosInstance"
import { toast } from "react-toastify"
import { UserContext } from "../../contexts/UserContext"

import "react-toastify/dist/ReactToastify.css"

const WorkoutPlanDetail = ({ plan: propsPlan, onBack }) => {
  const params = useParams()
  const id = params?.id || propsPlan?._id
  const navigate = useNavigate()
  const { loggedUser } = useContext(UserContext)

  const [plan, setPlan] = useState(propsPlan || null)
  const [isStarted, setIsStarted] = useState(false)
  const [modal, setModal] = useState({ edit: false, delete: false, addExercise: false })
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    category: "",
    difficulty: "",
    duration: "",
    frequency: "",
  })
  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
  })
  const [timer, setTimer] = useState(0)
  const [intervalId, setIntervalId] = useState(null)
  const [completedExercises, setCompletedExercises] = useState([])

  useEffect(() => {
    if (propsPlan) {
      setPlan(propsPlan)
      setEditData({
        name: propsPlan.name,
        description: propsPlan.description,
        category: propsPlan.category,
        difficulty: propsPlan.difficulty,
        duration: propsPlan.duration,
        frequency: propsPlan.frequency,
      })
    } else if (id) {
      const fetchWorkoutPlan = async () => {
        try {
          const response = await axiosInstance.get(`/workouts/${id}`)
          setPlan(response.data)
          setEditData({
            name: response.data.name,
            description: response.data.description,
            category: response.data.category,
            difficulty: response.data.difficulty,
            duration: response.data.duration,
            frequency: response.data.frequency,
          })
        } catch (error) {
          console.error("Failed to fetch workout plan:", error)
          toast.error("Failed to fetch workout plan!")
        }
      }
      fetchWorkoutPlan()
    }
  }, [id, propsPlan])

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [intervalId])

  const startWorkout = () => {
    setIsStarted(true)
    setCompletedExercises(new Array(plan.exercises.length).fill(false))
    const id = setInterval(() => setTimer((prev) => prev + 1), 1000)
    setIntervalId(id)
  }

  const finishWorkout = async () => {
    setIsStarted(false)
    clearInterval(intervalId)
    setTimer(0)
    setCompletedExercises([])

    try {
      await axiosInstance.post("/workout-sessions", {
        planId: plan._id,
        planName: plan.name,
        completedExercises: plan.exercises,
        duration: Number.parseInt(plan.duration) || 45,
      })

      // Set a flag to refresh dashboard data
      sessionStorage.setItem("dashboard_refresh_needed", "true")

      toast.success("Workout Saved Successfully!")
      navigate("/dashboard")
    } catch (error) {
      console.error("Failed to save workout session:", error)
      toast.error("Failed to save workout session!")
    }
  }

  const toggleExerciseComplete = (index) => {
    setCompletedExercises((prev) => {
      const newCompleted = [...prev]
      newCompleted[index] = !newCompleted[index]
      return newCompleted
    })
  }

  const openModal = (type) => setModal({ ...modal, [type]: true })
  const closeModal = () => setModal({ edit: false, delete: false, addExercise: false })

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/workouts/${id}`)
      toast.success("Workout Plan Deleted Successfully!")
      navigate("/workout")
    } catch (error) {
      console.error("Error deleting workout plan:", error)
      toast.error("Failed to delete workout plan!")
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.put(`/workouts/${id}`, editData)
      toast.success("Workout Plan Updated Successfully!")
      closeModal()
      navigate("/workout")
    } catch (error) {
      console.error("Error updating workout plan:", error)
      toast.error("Failed to update workout plan!")
    }
  }

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value })
  }

  const handleAddExerciseSubmit = async (e) => {
    e.preventDefault()
    try {
      const updatedExercises = [...plan.exercises, newExercise]
      await axiosInstance.put(`/workouts/${id}`, {
        ...editData,
        exercises: updatedExercises,
      })
      toast.success("Exercise added successfully!")
      setPlan({ ...plan, exercises: updatedExercises })
      setNewExercise({ name: "", sets: "", reps: "", weight: "" })
      closeModal()
    } catch (error) {
      console.error("Error adding exercise:", error)
      toast.error("Failed to add exercise.")
    }
  }

  const handleNewExerciseChange = (e) => {
    setNewExercise({ ...newExercise, [e.target.name]: e.target.value })
  }

  if (!plan) return <div className="p-6">Loading workout plan...</div>

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <button onClick={() => navigate("/workout")} className="flex items-center text-gray-600 hover:text-gray-800 mb-6">
        <FaArrowLeft className="mr-2" /> Back to Workout Plans
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-[#004D40]">{plan.name}</h1>
            <span className="bg-[#E8F5E9] text-[#28A745] text-xs font-medium px-2 py-1 rounded">{plan.category}</span>
          </div>
          <p className="text-gray-600 mb-4">{plan.description}</p>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center">
              <FaDumbbell className="text-[#28A745] mr-2" />
              <span className="text-sm text-gray-600">Difficulty: {plan.difficulty}</span>
            </div>
            <div className="flex items-center">
              <FaClock className="text-[#28A745] mr-2" />
              <span className="text-sm text-gray-600">{plan.duration} min</span>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="text-[#28A745] mr-2" />
              <span className="text-sm text-gray-600">{plan.frequency}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {isStarted ? (
            <button
              onClick={finishWorkout}
              className="flex items-center gap-2 bg-[#28A745] text-white px-4 py-2 rounded-lg hover:bg-[#218838]"
            >
              <FaCheckCircle /> Finish Workout
            </button>
          ) : (
            <button
              onClick={startWorkout}
              className="flex items-center gap-2 bg-[#28A745] text-white px-4 py-2 rounded-lg hover:bg-[#218838]"
            >
              <FaPlay /> Start Workout
            </button>
          )}
          <button
            onClick={() => openModal("addExercise")}
            disabled={isStarted}
            className={`flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg ${isStarted ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"}`}
          >
            <FaPlus /> Add
          </button>
          <button
            onClick={() => openModal("edit")}
            disabled={isStarted}
            className={`flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg ${isStarted ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"}`}
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={() => openModal("delete")}
            disabled={isStarted}
            className={`flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg ${isStarted ? "bg-gray-200 text-red-300 cursor-not-allowed" : "text-red-600 hover:bg-red-50"}`}
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      {isStarted && (
        <div className="mt-6 p-6 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg shadow-sm animate-pulse">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <FaPlay className="text-green-500" /> Workout In Progress
          </h2>
          <p>
            Stay strong! You are currently doing: <strong>{plan.name}</strong>
          </p>
          <p className="text-sm mt-2 italic">
            Workout Duration: {Math.floor(timer / 60)}m {timer % 60}s ⏱️
          </p>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Exercise Checklist:</h3>
            <ul className="space-y-2">
              {plan.exercises.map((exercise, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={completedExercises[idx] || false}
                    onChange={() => toggleExerciseComplete(idx)}
                    className="h-4 w-4"
                  />
                  <span className={completedExercises[idx] ? "line-through" : ""}>
                    {exercise.name} - {exercise.sets} sets x {exercise.reps} reps ({exercise.weight})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!isStarted && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Exercises</h2>
          <ul className="list-disc ml-6 space-y-2">
            {plan.exercises.map((exercise, idx) => (
              <li key={idx}>
                {exercise.name} - {exercise.sets} sets x {exercise.reps} reps ({exercise.weight})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Edit Modal */}
      {modal.edit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit Workout Plan</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">
                &times;
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {["name", "description", "category", "difficulty", "duration", "frequency"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  value={editData[field]}
                  onChange={handleEditChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              ))}
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#28A745] text-white rounded-lg hover:bg-[#218838]">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Exercise Modal */}
      {modal.addExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add New Exercise</h2>
            <form onSubmit={handleAddExerciseSubmit} className="space-y-4">
              {["name", "sets", "reps", "weight"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  value={newExercise[field]}
                  onChange={handleNewExerciseChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              ))}
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#28A745] text-white rounded-lg hover:bg-[#218838]">
                  Add Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modal.delete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Delete Workout Plan</h2>
            <p>Are you sure you want to delete this workout plan? This action cannot be undone.</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkoutPlanDetail
