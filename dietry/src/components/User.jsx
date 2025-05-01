/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useState, useContext } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/UserContext"
import { toast } from "react-toastify"
import {
  FaRulerVertical,
  FaWeight,
  FaVenusMars,
  FaRunning,
  FaBullseye,
  FaAllergies,
  FaEdit,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa"

const User = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(null) // 'details' | 'allergy' | null
  const { loggedUser, setLoggedUser } = useContext(UserContext)
  const navigate = useNavigate()

  const [userDetails, setUserDetails] = useState({
    height: "",
    weight: "",
    gender: "",
    activityLevel: "",
    goal: "",
  })

  const [allergy, setAllergy] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchUser = async () => {
    if (!loggedUser?.token) {
      setError("User not authenticated.")
      setLoading(false)
      return
    }

    try {
      const response = await axios.get("http://127.0.0.1:5000/me", {
        headers: {
          Authorization: `Bearer ${loggedUser.token}`,
        },
      })

      setUser(response.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching user:", err)
      setError("Failed to fetch user data.")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const handleDetailsSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const token = loggedUser.token

    try {
      const response = await fetch("http://127.0.0.1:5000/user-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userDetails),
      })

      const data = await response.json()

      if (response.ok) {
        const updatedUser = { ...loggedUser, ...userDetails, hasDetails: true }
        sessionStorage.setItem("diet-user", JSON.stringify(updatedUser))
        setLoggedUser(updatedUser)
        setShowModal(null)
        fetchUser()
        toast.success("Profile details updated successfully")
      } else {
        toast.error(data.message || "Failed to update details")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to update details")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAllergySubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const token = loggedUser.token

    try {
      const response = await fetch("http://127.0.0.1:5000/update-allergy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ allergy, hasAllergyInfo: true }),
      })

      const data = await response.json()

      if (response.ok) {
        const updatedUser = { ...loggedUser, allergy, hasAllergyInfo: true }
        sessionStorage.setItem("diet-user", JSON.stringify(updatedUser))
        setLoggedUser(updatedUser)
        setShowModal(null)
        fetchUser()
        toast.success("Allergy information updated successfully")
      } else {
        toast.error(data.message || "Failed to update allergy information")
      }
    } catch (err) {
      console.error("Error updating allergies:", err)
      toast.error("Failed to update allergy information")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openModal = (type) => {
    if (type === "details") {
      setUserDetails({
        height: user.height || "",
        weight: user.weight || "",
        gender: user.gender || "",
        activityLevel: user.activityLevel || "",
        goal: user.goal || "",
      })
    } else if (type === "allergy") {
      setAllergy(user.allergy || "")
    }
    setShowModal(type)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#28A745]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const formatValue = (key, value) => {
    if (!value) return "Not specified"

    if (key === "goal") {
      return value.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
    }

    if (key === "activityLevel") {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }

    if (key === "height") return `${value} cm`
    if (key === "weight") return `${value} kg`

    return value
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#004D40]">Profile Information</h1>
        <button onClick={() => navigate("/dashboard")} className="flex items-center text-gray-600 hover:text-gray-800">
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#28A745] to-[#218838] p-6 text-white">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#28A745] text-2xl font-bold">
              {user.name?.charAt(0) || "U"}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-green-100">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mt-1 mr-3 w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#28A745]">
                  <FaRulerVertical />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Height</p>
                  <p className="font-medium text-gray-800">{formatValue("height", user.height)}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-1 mr-3 w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#28A745]">
                  <FaWeight />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium text-gray-800">{formatValue("weight", user.weight)}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-1 mr-3 w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#28A745]">
                  <FaVenusMars />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium text-gray-800">{formatValue("gender", user.gender)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mt-1 mr-3 w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#28A745]">
                  <FaRunning />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Activity Level</p>
                  <p className="font-medium text-gray-800">{formatValue("activityLevel", user.activityLevel)}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-1 mr-3 w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#28A745]">
                  <FaBullseye />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fitness Goal</p>
                  <p className="font-medium text-gray-800">{formatValue("goal", user.goal)}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-1 mr-3 w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#28A745]">
                  <FaAllergies />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Allergies</p>
                  <p className="font-medium text-gray-800">{user.allergy || "None"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => openModal("details")}
              className="flex-1 bg-[#28A745] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#218838] transition-colors flex items-center justify-center"
            >
              <FaEdit className="mr-2" /> Update Profile
            </button>
            <button
              onClick={() => openModal("allergy")}
              className="flex-1 bg-[#E8F5E9] text-[#28A745] py-3 px-4 rounded-lg font-medium hover:bg-[#C8E6C9] transition-colors flex items-center justify-center"
            >
              <FaAllergies className="mr-2" /> Update Allergies
            </button>
          </div>
        </div>
      </div>

      {/* Update Profile Modal */}
      {showModal === "details" && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-popup transform scale-100 transition-all duration-300 relative">
            <div className="bg-[#28A745] py-4 px-6 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold">Update Profile</h3>
              <button onClick={() => setShowModal(null)} className="text-white hover:text-gray-200 focus:outline-none">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleDetailsSubmit} className="p-6 space-y-4">
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
                    onChange={(e) => setUserDetails({ ...userDetails, height: e.target.value })}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745]"
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
                    onChange={(e) => setUserDetails({ ...userDetails, weight: e.target.value })}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745]"
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
                    onChange={(e) => setUserDetails({ ...userDetails, gender: e.target.value })}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745]"
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
                    onChange={(e) => setUserDetails({ ...userDetails, activityLevel: e.target.value })}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745]"
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
                    onChange={(e) => setUserDetails({ ...userDetails, goal: e.target.value })}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745]"
                    required
                  >
                    <option value="">Select Goal</option>
                    <option value="lose_weight">Lose Weight</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain_muscle">Gain Muscle</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#28A745] text-white rounded-lg hover:bg-[#218838] flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Allergy Modal */}
      {showModal === "allergy" && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-popup transform scale-100 transition-all duration-300 relative">
            <div className="bg-[#28A745] py-4 px-6 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold">Update Allergies</h3>
              <button onClick={() => setShowModal(null)} className="text-white hover:text-gray-200 focus:outline-none">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAllergySubmit} className="p-6">
              <div className="mb-6">
                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaAllergies className="text-gray-400" />
                  </div>
                  <textarea
                    id="allergies"
                    value={allergy}
                    onChange={(e) => setAllergy(e.target.value)}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] transition-colors resize-none h-32"
                    placeholder="Enter any food allergies or intolerances (e.g., nuts, dairy, gluten)"
                  ></textarea>
                </div>
                <p className="mt-2 text-sm text-gray-500">Leave blank if you don&apos;t have any allergies.</p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#28A745] text-white rounded-lg hover:bg-[#218838] flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default User
