import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export default function UserDetails() {
  const { setLoggedUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    height: "",
    weight: "",
    gender: "",
    activityLevel: "",
    goal: "",
  });

  const [message, setMessage] = useState({ type: "invisible", text: "" });

  function handleInput(event) {
    setUserDetails((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const token = JSON.parse(sessionStorage.getItem("diet-user")).token;

    fetch("http://127.0.0.1:3000/user-details", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userDetails)
    })
    .then(response => response.json())
    .then(data => {
        setMessage({ type: "success", text: data.message });

        let storedUser = JSON.parse(sessionStorage.getItem("diet-user"));
        storedUser = { ...storedUser, ...userDetails, hasDetails: true };
        sessionStorage.setItem("diet-user", JSON.stringify(storedUser));
        setLoggedUser(storedUser);

        setTimeout(() => {
            navigate('/allergy-selection');
        }, 2000);
    })
    .catch(error => {
        setMessage({ type: "error", text: "Failed to update details" });
        console.error(error);
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#E8F5E9] to-[#A5D6A7] text-[#004D40] pt-[70px]">
      <form className="bg-white p-6 rounded-xl shadow-lg w-[350px] text-center" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-[#004D40] mb-4">Complete Your Profile</h1>
        <input
          className="w-full p-4 border-2 border-[#28A745] rounded-lg text-base outline-none transition-all duration-300 mb-4 h-[50px] focus:border-[#FF9800] focus:shadow-[0_0_6px_rgba(255,152,0,0.5)]"
          type="number"
          name="height"
          placeholder="Height (cm)"
          value={userDetails.height}
          onChange={handleInput}
          required
        />
        <input
          className="w-full p-4 border-2 border-[#28A745] rounded-lg text-base outline-none transition-all duration-300 mb-4 h-[50px] focus:border-[#FF9800] focus:shadow-[0_0_6px_rgba(255,152,0,0.5)]"
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          value={userDetails.weight}
          onChange={handleInput}
          required
        />
        <select
          className="w-full p-4 border-2 border-[#28A745] rounded-lg text-base outline-none transition-all duration-300 mb-4 h-[50px] focus:border-[#FF9800] focus:shadow-[0_0_6px_rgba(255,152,0,0.5)]"
          name="gender"
          value={userDetails.gender}
          onChange={handleInput}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <select
          className="w-full p-4 border-2 border-[#28A745] rounded-lg text-base outline-none transition-all duration-300 mb-4 h-[50px] focus:border-[#FF9800] focus:shadow-[0_0_6px_rgba(255,152,0,0.5)]"
          name="activityLevel"
          value={userDetails.activityLevel}
          onChange={handleInput}
          required
        >
          <option value="">Select Activity Level</option>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light Activity</option>
          <option value="moderate">Moderate Activity</option>
          <option value="active">Very Active</option>
        </select>
        <select
          className="w-full p-4 border-2 border-[#28A745] rounded-lg text-base outline-none transition-all duration-300 mb-4 h-[50px] focus:border-[#FF9800] focus:shadow-[0_0_6px_rgba(255,152,0,0.5)]"
          name="goal"
          value={userDetails.goal}
          onChange={handleInput}
          required
        >
          <option value="">Select Goal</option>
          <option value="lose_weight">Lose Weight</option>
          <option value="maintain">Maintain Weight</option>
          <option value="gain_muscle">Gain Muscle</option>
        </select>
        <button className="w-full p-3 mt-2 border-none rounded-lg text-base font-bold cursor-pointer transition-all duration-300 bg-[#a7dfa2] hover:bg-[#28A745] hover:text-white">
          Save Details
        </button>
        <p className={message.type === "success" ? "text-green-600" : "text-red-600"}>{message.text}</p>
      </form>
    </div>
  );
}