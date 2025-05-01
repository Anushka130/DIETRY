/* eslint-disable react/prop-types */
"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState, useContext, useEffect } from "react"
import { UserContext } from "../contexts/UserContext"
import { FaHeartbeat, FaEnvelope, FaLock, FaArrowLeft, FaTimes } from "react-icons/fa"
import { toast } from "react-toastify"

export default function Login({ isPopup = false, onClose, onSwitchToRegister }) {
  const { setLoggedUser } = useContext(UserContext)
  const navigate = useNavigate()
  const [userCred, setUserCred] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("diet-user"))
    if (storedUser && storedUser.token) {
      if (storedUser.hasDetails) {
        navigate("/dashboard")
      } else {
        navigate("/details")
      }
    }
  }, [navigate])

  function handleInput(event) {
    setUserCred((prevState) => ({ ...prevState, [event.target.name]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)

    fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userCred),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false)
        if (data.token) {
          sessionStorage.setItem("diet-user", JSON.stringify(data))
          setLoggedUser(data)
          toast.success("Login successful!")

          if (!data.hasDetails) {
            navigate("/details")
          } else if (!data.hasAllergyInfo) {
            navigate("/allergy-selection")
          } else {
            navigate("/dashboard")
          }
        } else {
          toast.error(data.message || "Login failed")
        }
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
        toast.error("An error occurred. Please try again.")
      })
  }

  return (
    <div
      className={`${isPopup ? "" : "min-h-screen bg-gradient-to-br from-[#E8F5E9] to-[#A5D6A7] flex items-center justify-center px-4 py-12"}`}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-popup transform scale-100 transition-all duration-300 relative">
        <div className="bg-[#28A745] py-4 px-6 text-white flex items-center justify-between">
          <div className="flex items-center">
            <FaHeartbeat className="text-xl" />
            <h1 className="ml-3 text-xl font-bold">DIETRY</h1>
          </div>
          {isPopup ? (
            <button onClick={onClose} className="text-white hover:text-gray-200 focus:outline-none">
              <FaTimes />
            </button>
          ) : (
            <Link to="/" className="text-white hover:text-[#E8F5E9] transition-colors">
              <FaArrowLeft />
            </Link>
          )}
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#004D40] mb-6 text-center">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={userCred.email}
                  onChange={handleInput}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={userCred.password}
                  onChange={handleInput}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#28A745] text-white py-3 rounded-lg font-medium hover:bg-[#218838] transition-colors focus:outline-none focus:ring-2 focus:ring-[#28A745] focus:ring-offset-2 flex items-center justify-center"
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
                "Login"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don&apos;t have an account?{" "}
            {isPopup ? (
              <button
                onClick={onSwitchToRegister}
                className="text-[#28A745] font-medium hover:text-[#218838] transition-colors"
              >
                Sign up
              </button>
            ) : (
              <Link to="/register" className="text-[#28A745] font-medium hover:text-[#218838] transition-colors">
                Sign up
              </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
