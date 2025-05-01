/* eslint-disable react/prop-types */
"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { toast } from "react-toastify"
import { FaHeartbeat, FaUser, FaEnvelope, FaLock, FaBirthdayCake, FaArrowLeft, FaTimes } from "react-icons/fa"
import "react-toastify/dist/ReactToastify.css"

export default function Register({ isPopup = false, onClose, onSwitchToLogin }) {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  function handleInput(event) {
    setUserDetails((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)

    fetch("http://127.0.0.1:5000/register", {
      method: "POST",
      body: JSON.stringify(userDetails),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false)
        toast.success(data.message)
        setUserDetails({
          name: "",
          email: "",
          password: "",
          age: "",
        })

        setTimeout(() => {
          if (isPopup) {
            onSwitchToLogin()
          } else {
            navigate("/login")
          }
        }, 2000)
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
        toast.error("Registration failed")
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
          <h2 className="text-2xl font-bold text-[#004D40] mb-6 text-center">Create Your Account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={userDetails.name}
                  onChange={handleInput}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  value={userDetails.email}
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
                  maxLength={10}
                  value={userDetails.password}
                  onChange={handleInput}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBirthdayCake className="text-gray-400" />
                </div>
                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  min={10}
                  max={100}
                  value={userDetails.age}
                  onChange={handleInput}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] transition-colors"
                  placeholder="25"
                />
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
                "Register"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            {isPopup ? (
              <button
                onClick={onSwitchToLogin}
                className="text-[#28A745] font-medium hover:text-[#218838] transition-colors"
              >
                Login
              </button>
            ) : (
              <Link to="/login" className="text-[#28A745] font-medium hover:text-[#218838] transition-colors">
                Login
              </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
