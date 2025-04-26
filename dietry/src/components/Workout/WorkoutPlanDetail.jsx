// components/Workout/WorkoutPlanDetail.jsx
import { useState } from "react"
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaClock, 
  FaDumbbell, 
  FaEdit, 
  FaPlay, 
  FaPlus, 
  FaTrash 
} from "react-icons/fa"

const WorkoutPlanDetail = ({ plan, onBack }) => {
  const [activeTab, setActiveTab] = useState("exercises")
  const [completedExercises, setCompletedExercises] = useState([])
  const [isStarted, setIsStarted] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const toggleExerciseCompletion = (exerciseName) => {
    if (completedExercises.includes(exerciseName)) {
      setCompletedExercises(completedExercises.filter((name) => name !== exerciseName))
    } else {
      setCompletedExercises([...completedExercises, exerciseName])
    }
  }

  const startWorkout = () => {
    setIsStarted(true)
    setCompletedExercises([])
  }

  const finishWorkout = () => {
    setIsStarted(false)
    // Here you would typically save the workout completion to your backend
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Workout Plans
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-[#004D40]">{plan.name}</h1>
            <span className="bg-[#E8F5E9] text-[#28A745] text-xs font-medium px-2 py-1 rounded">
              {plan.category}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{plan.description}</p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center">
              <FaDumbbell className="text-[#28A745] mr-2" />
              <span className="text-sm text-gray-600">Difficulty: {plan.difficulty}</span>
            </div>
            <div className="flex items-center">
              <FaClock className="text-[#28A745] mr-2" />
              <span className="text-sm text-gray-600">{plan.duration}</span>
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
              className="flex items-center gap-2 bg-[#28A745] text-white px-4 py-2 rounded-lg hover:bg-[#218838] transition-colors"
            >
              <FaCheckCircle /> Finish Workout
            </button>
          ) : (
            <button
              onClick={startWorkout}
              className="flex items-center gap-2 bg-[#28A745] text-white px-4 py-2 rounded-lg hover:bg-[#218838] transition-colors"
            >
              <FaPlay /> Start Workout
            </button>
          )}

          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaEdit /> Edit
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 border border-gray-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-800">Overall Progress</h3>
          <span className="text-sm font-medium text-[#28A745]">{plan.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#28A745] h-2 rounded-full" 
            style={{ width: `${plan.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-3 gap-2">
          <button
            className={`py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === "exercises" 
                ? "bg-[#28A745] text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-[#E8F5E9]"
            }`}
            onClick={() => setActiveTab("exercises")}
          >
            Exercises
          </button>
          <button
            className={`py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === "history" 
                ? "bg-[#28A745] text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-[#E8F5E9]"
            }`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
          <button
            className={`py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === "notes" 
                ? "bg-[#28A745] text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-[#E8F5E9]"
            }`}
            onClick={() => setActiveTab("notes")}
          >
            Notes
          </button>
        </div>
      </div>

      {activeTab === "exercises" && (
        <div className="space-y-4">
          {plan.exercises.map((exercise, index) => (
            <div
              key={index}
              className={`border ${
                isStarted && completedExercises.includes(exercise.name)
                  ? "border-[#C8E6C9] bg-[#E8F5E9]"
                  : "border-gray-200 bg-white"
              } rounded-lg overflow-hidden transition-all`}
            >
              <div className="p-4 pb-2 flex flex-row items-center justify-between">
                <h3 className="text-lg font-medium">{exercise.name}</h3>
                {isStarted && (
                  <button
                    onClick={() => toggleExerciseCompletion(exercise.name)}
                    className={`${
                      completedExercises.includes(exercise.name) 
                        ? "text-[#28A745]" 
                        : "text-gray-400"
                    }`}
                  >
                    <FaCheckCircle className="text-xl" />
                  </button>
                )}
              </div>
              <div className="p-4 pt-0">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Sets</p>
                    <p className="font-medium">{exercise.sets}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Reps</p>
                    <p className="font-medium">{exercise.reps}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Weight</p>
                    <p className="font-medium">{exercise.weight}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            className="w-full mt-4 border border-dashed border-gray-300 text-gray-600 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <FaPlus /> Add Exercise
          </button>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <FaCalendarAlt className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Workout History Yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You haven't completed any workouts with this plan yet. Start a workout to begin tracking your progress.
          </p>
          {!isStarted && (
            <button
              onClick={startWorkout}
              className="flex items-center gap-2 bg-[#28A745] text-white px-4 py-2 rounded-lg hover:bg-[#218838] transition-colors mx-auto"
            >
              <FaPlay /> Start Workout
            </button>
          )}
        </div>
      )}

      {activeTab === "notes" && (
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Workout Notes</h3>
          <textarea
            className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28A745] focus:border-transparent"
            placeholder="Add notes about this workout plan here..."
          ></textarea>
          <button className="mt-4 bg-[#28A745] text-white px-4 py-2 rounded-lg hover:bg-[#218838] transition-colors">
            Save Notes
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Edit Workout Plan</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue={plan.name}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Description
                </label>
                <input
                  type="text"
                  defaultValue={plan.description}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  defaultValue={plan.duration}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button 
                className="bg-[#28A745] text-white px-4 py-2 rounded-lg hover:bg-[#218838] transition-colors"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Delete Workout Plan</h2>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <p>Are you sure you want to delete this workout plan? This action cannot be undone.</p>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-between">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={onBack}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
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