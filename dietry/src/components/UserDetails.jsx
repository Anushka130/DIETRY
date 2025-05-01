"use client"

import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { UserContext } from "../contexts/UserContext"
import { FaHeartbeat, FaRulerVertical, FaWeight, FaVenusMars, FaRunning, FaBullseye, FaArrowLeft } from "react-icons/fa"
import { toast } from "react-toastify"

export default function UserDetails() {
  const { setLoggedUser } = useContext(UserContext)
  const navigate = useNavigate()

  const [userDetails, setUserDetails] = useState({
    height: "",
    weight: "",
    gender: "",
    activityLevel: "",
    goal: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  function handleInput(event) {
    setUserDetails((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    const token = JSON.parse(sessionStorage.getItem("diet-user")).token

    fetch("http://127.0.0.1:5000/user-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userDetails),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false)
        toast.success(data.message || "Profile details updated successfully")

        let storedUser = JSON.parse(sessionStorage.getItem("diet-user"))
        storedUser = { ...storedUser, ...userDetails, hasDetails: true }
        sessionStorage.setItem("diet-user", JSON.stringify(storedUser))
        setLoggedUser(storedUser)

        navigate("/allergy-selection")
      })
      .catch((error) => {
        setIsLoading(false)
        toast.error("Failed to update details")
        console.error(error)
      })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F5E9] to-[#A5D6A7] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#28A745] py-6 px-8 text-white flex items-center justify-between">
          <div className="flex items-center">
            <FaHeartbeat className="text-2xl" />
            <h1 className="ml-3 text-2xl font-bold">DIETRY</h1>
          </div>
          <Link to="/login" className="text-white hover:text-[#E8F5E9] transition-colors">
            <FaArrowLeft />
          </Link>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-[#004D40] mb-6 text-center">Complete Your Profile</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                Height (cm)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaRulerVertical className="text-gray-400" />
                </div>
                <input
                  id="height"
                  name="height"
                  type="number"
                  required
                  value={userDetails.height}
                  onChange={handleInput}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] transition-colors"
                  placeholder="175"
                />
              </div>
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaWeight className="text-gray-400" />
                </div>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  required
                  value={userDetails.weight}
                  onChange={handleInput}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] transition-colors"
                  placeholder="70"
                />
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaVenusMars className="text-gray-400" />
                </div>
                <select
                  id="gender"
                  name="gender"
                  value={userDetails.gender}
                  onChange={handleInput}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] transition-colors"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Activity Level
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaRunning className="text-gray-400" />
                </div>
                <select
                  id="activityLevel"
                  name="activityLevel"
                  value={userDetails.activityLevel}
                  onChange={handleInput}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] transition-colors"
                  required
                >
                  <option value="">Select Activity Level</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light Activity</option>
                  <option value="moderate">Moderate Activity</option>
                  <option value="active">Very Active</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                Fitness Goal
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBullseye className="text-gray-400" />
                </div>
                <select
                  id="goal"
                  name="goal"
                  value={userDetails.goal}
                  onChange={handleInput}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] transition-colors"
                  required
                >
                  <option value="">Select Goal</option>
                  <option value="lose_weight">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain_muscle">Gain Muscle</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#28A745] text-white py-3 rounded-lg font-medium hover:bg-[#218838] transition-colors focus:outline-none focus:ring-2 focus:ring-[#28A745] focus:ring-offset-2 flex items-center justify-center mt-6"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Save & Continue"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
