import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const User = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(null); // 'details' | 'allergy' | null
  const { loggedUser, setLoggedUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    height: "",
    weight: "",
    gender: "",
    activityLevel: "",
    goal: "",
  });

  const [allergy, setAllergy] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchUser = async () => {
    if (!loggedUser?.token) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:5000/me", {
        headers: {
          Authorization: `Bearer ${loggedUser.token}`,
        },
      });

      setUser(response.data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching user:", err);
      setError("Failed to fetch user data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    const token = loggedUser.token;

    fetch("http://127.0.0.1:5000/user-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userDetails),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage({ type: "success", text: data.message });
        const updatedUser = { ...loggedUser, ...userDetails, hasDetails: true };
        sessionStorage.setItem("diet-user", JSON.stringify(updatedUser));
        setLoggedUser(updatedUser);
        setShowPopup(null);
        fetchUser();
      })
      .catch((err) => {
        console.error(err);
        setMessage({ type: "error", text: "Failed to update details" });
      });
  };

  const handleAllergySubmit = (e) => {
    e.preventDefault();
    const token = loggedUser.token;

    fetch("http://127.0.0.1:5000/update-allergy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ allergy, hasAllergyInfo: true }),
    })
      .then((res) => res.json())
      .then(() => {
        const updatedUser = { ...loggedUser, allergy, hasAllergyInfo: true };
        sessionStorage.setItem("diet-user", JSON.stringify(updatedUser));
        setLoggedUser(updatedUser);
        setShowPopup(null);
        fetchUser();
      })
      .catch((err) => console.error("Error updating allergies:", err));
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200 relative">
      <div className="flex items-center justify-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center">User Profile</h1>
      </div>

      <div className="absolute top-5 left-5 flex items-center space-x-2">
        {/* Back Button with a more attractive style */}
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H6M12 5l-7 6 7 6"
            />
          </svg>
          <span className="text-sm">Back</span>
        </button>
      </div>

      <div className="space-y-2 text-gray-700 text-sm">
        <p><span className="font-semibold">Name:</span> {user.name}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
        <p><span className="font-semibold">Age:</span> {user.age}</p>
        <p><span className="font-semibold">Gender:</span> {user.gender || "Not specified"}</p>
        <p><span className="font-semibold">Height:</span> {user.height ? `${user.height} cm` : "Not specified"}</p>
        <p><span className="font-semibold">Weight:</span> {user.weight ? `${user.weight} kg` : "Not specified"}</p>
        <p><span className="font-semibold">Activity Level:</span> {user.activityLevel || "Not specified"}</p>
        <p><span className="font-semibold">Goal:</span> {user.goal?.replace("_", " ") || "Not specified"}</p>
        <p><span className="font-semibold">Allergy:</span> {user.allergy || "None"}</p>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => {
            setUserDetails({
              height: user.height || "",
              weight: user.weight || "",
              gender: user.gender || "",
              activityLevel: user.activityLevel || "",
              goal: user.goal || "",
            });
            setShowPopup("details");
          }}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Update Info
        </button>
        <button
          onClick={() => {
            setAllergy(user.allergy || "");
            setShowPopup("allergy");
          }}
          className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Update Allergy
        </button>
      </div>

      {/* POPUP FORM */}
      {showPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative animate-fadeIn h-auto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPopup(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl"
            >
              &times;
            </button>

            {showPopup === "details" && (
              <form onSubmit={handleDetailsSubmit} className="space-y-4 mt-8">
                <h2 className="text-xl font-bold mb-2">Update Details</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={userDetails.height}
                    onChange={(e) => setUserDetails({ ...userDetails, height: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={userDetails.weight}
                    onChange={(e) => setUserDetails({ ...userDetails, weight: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={userDetails.gender}
                    onChange={(e) => setUserDetails({ ...userDetails, gender: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
                  <select
                    name="activityLevel"
                    value={userDetails.activityLevel}
                    onChange={(e) => setUserDetails({ ...userDetails, activityLevel: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Activity Level</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light Activity</option>
                    <option value="moderate">Moderate Activity</option>
                    <option value="active">Very Active</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
                  <select
                    name="goal"
                    value={userDetails.goal}
                    onChange={(e) => setUserDetails({ ...userDetails, goal: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Goal</option>
                    <option value="lose_weight">Lose Weight</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain_muscle">Gain Muscle</option>
                  </select>
                </div>

                <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Save Details</button>
              </form>
            )}

            {showPopup === "allergy" && (
              <form onSubmit={handleAllergySubmit} className="space-y-3 mt-8">
                <h2 className="text-xl font-bold mb-2">Update Allergy Info</h2>
                <textarea
                  value={allergy}
                  onChange={(e) => setAllergy(e.target.value)}
                  placeholder="Enter allergies (optional)"
                  className="w-full h-24 p-2 border rounded resize-none"
                />
                <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Save Allergy</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
