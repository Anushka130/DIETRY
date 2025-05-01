import { useEffect, useState } from "react";
import { FaArrowLeft, FaDumbbell, FaCalendarAlt, FaFire, FaMedal } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { toast } from "react-toastify";

// Helper function to format date nicely
const formatDateTime = (isoString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(isoString).toLocaleString(undefined, options);
};

const WorkoutHistory = () => {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkoutSessions();
  }, []);

  const fetchWorkoutSessions = async () => {
    try {
      const response = await axiosInstance.get("/workout-sessions");
      setSessions(response.data);
    } catch (error) {
      console.error("Failed to fetch workout sessions:", error);
      toast.error("Failed to load workout history!");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <button
        onClick={() => navigate("/workout")}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Workout Plans
      </button>

      <h1 className="text-2xl font-bold text-[#004D40] mb-6">Workout History</h1>

      {/* Calories Summary */}
      {sessions.length > 0 && (
        <div className="mb-6 bg-orange-50 border-l-4 border-orange-400 text-orange-700 p-4 rounded-lg">
          <h2 className="font-semibold text-lg">
            Total Calories Burned:{" "}
            {sessions.reduce((acc, session) => acc + (session.caloriesBurned || 0), 0)} kcal 🔥
          </h2>
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="text-center py-20">
          <FaDumbbell className="text-gray-300 text-6xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No completed workouts yet!</h2>
          <p className="text-gray-500 mb-6">Start your first workout and it will show up here.</p>
          <button
            onClick={() => navigate("/workout")}
            className="px-6 py-3 bg-[#28A745] text-white rounded-lg hover:bg-[#218838] transition"
          >
            Get Started
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map((session) => (
            <div key={session._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-[#004D40]">{session.planName}</h2>
                {/* Completed Badge */}
                <span className="flex items-center text-green-600 text-sm bg-green-100 px-2 py-1 rounded-lg">
                  <FaMedal className="mr-1" /> Completed
                </span>
              </div>

              <div className="flex items-center text-gray-600 text-sm mb-2">
                <FaCalendarAlt className="mr-2" />
                {formatDateTime(session.completedAt)}
              </div>

              {/* Calories Burned */}
              {session.caloriesBurned && session.caloriesBurned > 0 ? (
                <div className="flex items-center text-orange-600 text-sm mb-4">
                  <FaFire className="mr-2" />
                  Burned {session.caloriesBurned} kcal
                </div>
              ) : (
                <div className="flex items-center text-gray-400 text-sm mb-4 italic">
                  <FaFire className="mr-2" />
                  Calories not recorded
                </div>
              )}

              <h3 className="font-semibold text-gray-800 mb-2">Exercises Completed:</h3>
              <ul className="list-disc ml-6 text-gray-600">
                {session.completedExercises.map((exercise, index) => (
                  <li key={index}>
                    {exercise.name} - {exercise.sets} sets x {exercise.reps} reps ({exercise.weight})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;
