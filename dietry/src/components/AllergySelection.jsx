/* eslint-disable no-unused-vars */
"use client"

import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { UserContext } from "../contexts/UserContext"
import { FaHeartbeat, FaAllergies, FaArrowLeft } from "react-icons/fa"
import { toast } from "react-toastify"

export default function AllergySelection() {
  const { setLoggedUser } = useContext(UserContext)
  const navigate = useNavigate()

  const [allergy, setAllergy] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    updateAllergy(allergy)
  }

  function skipAllergy() {
    updateAllergy("")
  }

  function updateAllergy(allergyValue) {
    setIsLoading(true)
    const token = JSON.parse(sessionStorage.getItem("diet-user")).token

    fetch("http://localhost:5000/update-allergy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ allergy: allergyValue, hasAllergyInfo: true }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false)
        const storedUser = JSON.parse(sessionStorage.getItem("diet-user"))
        storedUser.allergy = allergyValue
        storedUser.hasAllergyInfo = true
        sessionStorage.setItem("diet-user", JSON.stringify(storedUser))
        setLoggedUser(storedUser)

        toast.success("Profile updated successfully!")
        navigate("/dashboard")
      })
      .catch((error) => {
        setIsLoading(false)
        console.error("Error updating allergies:", error)
        toast.error("Failed to update profile")
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
          <Link to="/details" className="text-white hover:text-[#E8F5E9] transition-colors">
            <FaArrowLeft />
          </Link>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-[#004D40] mb-6 text-center">Do you have any allergies?</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
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
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#28A745] text-white py-3 rounded-lg font-medium hover:bg-[#218838] transition-colors focus:outline-none focus:ring-2 focus:ring-[#28A745] focus:ring-offset-2 flex items-center justify-center"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                ) : (
                  "Save & Continue"
                )}
              </button>

              <button
                type="button"
                onClick={skipAllergy}
                disabled={isLoading}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Skip
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
