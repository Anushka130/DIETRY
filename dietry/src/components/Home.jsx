/* eslint-disable no-unused-vars */
"use client"

import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  FaAppleAlt,
  FaDumbbell,
  FaHeartbeat,
  FaChartLine,
  FaCheck,
  FaArrowRight,
  FaBars,
  FaTimes,
} from "react-icons/fa"
import Login from "./Login"
import Register from "./Register"

export default function Home() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [showRegisterPopup, setShowRegisterPopup] = useState(false)
  const [popupOrigin, setPopupOrigin] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const openLoginPopup = (e) => {
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect()
      setPopupOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
    }
    setShowLoginPopup(true)
    setShowRegisterPopup(false)
    setMobileMenuOpen(false)
  }

  const openRegisterPopup = (e) => {
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect()
      setPopupOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
    }
    setShowRegisterPopup(true)
    setShowLoginPopup(false)
    setMobileMenuOpen(false)
  }

  const closePopups = () => {
    setShowLoginPopup(false)
    setShowRegisterPopup(false)
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full py-4 px-6 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-[#28A745] w-10 h-10 rounded-full flex items-center justify-center">
              <FaHeartbeat className="text-white text-xl" />
            </div>
            <h1 className="ml-3 text-2xl font-bold text-[#004D40]">DIETRY</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              className="text-[#004D40] font-medium hover:text-[#28A745] transition-colors"
              onClick={(e) => openLoginPopup(e)}
            >
              Login
            </button>
            <button
              className="bg-[#28A745] text-white px-6 py-2 rounded-full font-medium hover:bg-[#218838] transition-colors shadow-md"
              onClick={(e) => openRegisterPopup(e)}
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-[#004D40] focus:outline-none" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md py-4 px-6 flex flex-col space-y-4 animate-fadeIn">
            <button
              className="text-[#004D40] font-medium hover:text-[#28A745] transition-colors w-full text-left py-2"
              onClick={(e) => openLoginPopup(e)}
            >
              Login
            </button>
            <button
              className="bg-[#28A745] text-white px-6 py-3 rounded-full font-medium hover:bg-[#218838] transition-colors shadow-md w-full"
              onClick={(e) => openRegisterPopup(e)}
            >
              Sign Up
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#E8F5E9] to-[#A5D6A7]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#004D40] leading-tight mb-6">
                Your Health Journey <span className="text-[#28A745]">Starts Here</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
                Track nutrition, plan workouts, and achieve your fitness goals with our all-in-one health companion.
              </p>
              <button
                onClick={(e) => openRegisterPopup(e)}
                className="group bg-[#FF9800] text-white text-lg px-8 py-4 rounded-full font-medium hover:bg-[#FB8C00] transition-all duration-300 shadow-lg flex items-center"
              >
                GET STARTED
                <FaArrowRight className="ml-2 group-hover:ml-4 transition-all duration-300" />
              </button>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#28A745] rounded-full opacity-20"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#FF9800] rounded-full opacity-20"></div>
                <div className="bg-white rounded-2xl shadow-2xl p-6 relative z-10">
                  <div className="bg-[#28A745] rounded-xl w-full h-64 md:h-80 flex items-center justify-center overflow-hidden">
                    <FaHeartbeat className="text-white text-8xl animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#004D40] mb-4">Everything You Need To Stay Healthy</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive tools help you track, plan, and achieve your health and fitness goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
              <div className="bg-[#28A745] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <FaAppleAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-[#004D40] mb-4">Food Tracking</h3>
              <p className="text-gray-600">
                Log your meals, track calories, and monitor your nutrition intake with our comprehensive food diary.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
              <div className="bg-[#28A745] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <FaDumbbell className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-[#004D40] mb-4">Workout Plans</h3>
              <p className="text-gray-600">
                Create custom workout routines, track your progress, and achieve your fitness goals with guided
                exercises.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
              <div className="bg-[#28A745] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-[#004D40] mb-4">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your health journey with detailed analytics, charts, and personalized insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#004D40] mb-4">How DIETRY Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to start your health journey with us.
            </p>
          </div>

          <div className="relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-[#28A745] transform -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
              {[
                { number: 1, title: "Create Account", desc: "Sign up and set your personal health and fitness goals" },
                { number: 2, title: "Track Meals", desc: "Log your daily food intake and monitor nutrition" },
                { number: 3, title: "Plan Workouts", desc: "Create and follow personalized workout routines" },
                { number: 4, title: "Achieve Goals", desc: "Track progress and celebrate your health milestones" },
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg border-4 border-[#28A745]">
                    <span className="text-2xl font-bold text-[#28A745]">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#004D40] mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#E8F5E9] opacity-50"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#E8F5E9] opacity-60"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-[#A5D6A7] opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-[#E8F5E9] text-[#28A745] rounded-full text-sm font-semibold mb-4">
              WHY CHOOSE US
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#004D40]">Why Choose DIETRY</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform offers unique advantages to help you on your health journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Personalized Experience",
                desc: "Tailored nutrition and workout recommendations based on your goals and preferences.",
                icon: <FaCheck className="text-white" />,
              },
              {
                title: "Comprehensive Tracking",
                desc: "Monitor calories, macros, workouts, and progress all in one place.",
                icon: <FaCheck className="text-white" />,
              },
              {
                title: "Easy to Use",
                desc: "Intuitive interface designed for seamless tracking and planning.",
                icon: <FaCheck className="text-white" />,
              },
              
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-start bg-white p-8 rounded-2xl shadow-lg border-l-4 border-[#28A745] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="mr-6">
                  <div className="bg-[#28A745] w-12 h-12 rounded-full flex items-center justify-center shadow-md">
                    {benefit.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-[#004D40]">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={(e) => openRegisterPopup(e)}
              className="bg-[#28A745] text-white px-8 py-3 rounded-full font-medium hover:bg-[#218838] transition-all duration-300 shadow-lg inline-flex items-center"
            >
              Start Your Journey
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#004D40] mb-6">Ready to Transform Your Health?</h2>
          <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
            Join thousands of users who have already started their journey to better health with DIETRY.
          </p>
          <button
            onClick={(e) => openRegisterPopup(e)}
            className="group bg-[#FF9800] text-white text-lg px-10 py-4 rounded-full font-medium hover:bg-[#FB8C00] transition-all duration-300 shadow-lg inline-flex items-center"
          >
            START YOUR FREE JOURNEY TODAY
            <FaArrowRight className="ml-2 group-hover:ml-4 transition-all duration-300" />
          </button>
          <p className="mt-6 text-sm text-gray-500">No credit card required. Start your health journey now.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#004D40] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center">
                  <FaHeartbeat className="text-[#28A745] text-xl" />
                </div>
                <h3 className="ml-3 text-2xl font-bold">DIETRY</h3>
              </div>
              <p className="text-gray-300 max-w-md mx-auto">
                Your all-in-one solution for tracking nutrition, planning workouts, and achieving your health goals.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 mt-8 text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} DIETRY. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {showLoginPopup && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div
            className="relative z-50 w-full max-w-md animate-popup-from-button"
            style={{
              "--origin-x": `${popupOrigin.x}px`,
              "--origin-y": `${popupOrigin.y}px`,
            }}
          >
            <Login isPopup={true} onClose={closePopups} onSwitchToRegister={openRegisterPopup} />
          </div>
        </div>
      )}

      {showRegisterPopup && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div
            className="relative z-50 w-full max-w-md animate-popup-from-button"
            style={{
              "--origin-x": `${popupOrigin.x}px`,
              "--origin-y": `${popupOrigin.y}px`,
            }}
          >
            <Register isPopup={true} onClose={closePopups} onSwitchToLogin={openLoginPopup} />
          </div>
        </div>
      )}
    </div>
  )
}
