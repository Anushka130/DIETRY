/* eslint-disable react/prop-types */
"use client"

import { useState, useContext } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { UserContext } from "../../contexts/UserContext"
import {
  FaHome,
  FaUser,
  FaUtensils,
  FaDumbbell,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHeartbeat,
  FaSearch,
  FaChevronDown,
  FaChevronRight,
  FaAppleAlt,
  FaCoffee,
  FaCarrot,
  FaCookieBite,
  FaGlassWhiskey,
  FaRegStickyNote,
} from "react-icons/fa"

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [foodMenuOpen, setFoodMenuOpen] = useState(false)
  const { loggedUser, setLoggedUser } = useContext(UserContext)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?")
    if (confirmLogout) {
      sessionStorage.removeItem("diet-user")
      setLoggedUser(null)
      navigate("/")
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const isActive = (path) => {
    return location.pathname.startsWith(path)
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-white fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out shadow-lg md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-[#28A745] w-8 h-8 rounded-md flex items-center justify-center">
              <FaHeartbeat className="text-white" />
            </div>
            <span className="ml-3 text-xl font-semibold text-[#004D40]">DIETRY</span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none">
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#28A745] font-semibold">
              {loggedUser?.name?.charAt(0) || "U"}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">{loggedUser?.name || "User"}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6">
          <ul className="space-y-1">
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive("/dashboard") ? "bg-[#E8F5E9] text-[#28A745]" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className={`${isActive("/dashboard") ? "text-[#28A745]" : "text-gray-500"} mr-3`}>
                  <FaHome className="text-xl" />
                </span>
                <span className="font-medium">Overview</span>
              </Link>
            </li>

            <li>
              <div
                onClick={() => setFoodMenuOpen(!foodMenuOpen)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  isActive("/food") ? "bg-[#E8F5E9] text-[#28A745]" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className={`${isActive("/food") ? "text-[#28A745]" : "text-gray-500"} mr-3`}>
                  <FaUtensils className="text-xl" />
                </span>
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">Foods</span>
                  {foodMenuOpen ? (
                    <FaChevronDown className="text-gray-400 text-xs" />
                  ) : (
                    <FaChevronRight className="text-gray-400 text-xs" />
                  )}
                </div>
              </div>

              {foodMenuOpen && (
                <ul className="ml-8 mt-1 space-y-1">
                  <li>
                    <Link
                      to="/food/diary"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        location.pathname === "/food/diary"
                          ? "bg-[#E8F5E9] text-[#28A745]"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <FaAppleAlt className="mr-3 text-[#28A745] text-sm" />
                      <span>Food Diary</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/food/breakfast"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        location.pathname === "/food/breakfast"
                          ? "bg-[#E8F5E9] text-[#28A745]"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <FaCoffee className="mr-3 text-[#28A745] text-sm" />
                      <span>Breakfast</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/food/lunch"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        location.pathname === "/food/lunch"
                          ? "bg-[#E8F5E9] text-[#28A745]"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <FaUtensils className="mr-3 text-[#28A745] text-sm" />
                      <span>Lunch</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/food/dinner"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        location.pathname === "/food/dinner"
                          ? "bg-[#E8F5E9] text-[#28A745]"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <FaCarrot className="mr-3 text-[#28A745] text-sm" />
                      <span>Dinner</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/food/snacks"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        location.pathname === "/food/snacks"
                          ? "bg-[#E8F5E9] text-[#28A745]"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <FaCookieBite className="mr-3 text-[#28A745] text-sm" />
                      <span>Snacks</span>
                    </Link>
                  </li>
                  
                </ul>
              )}
            </li>

            <li>
              <Link
                to="/workout"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive("/workout") ? "bg-[#E8F5E9] text-[#28A745]" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className={`${isActive("/workout") ? "text-[#28A745]" : "text-gray-500"} mr-3`}>
                  <FaDumbbell className="text-xl" />
                </span>
                <span className="font-medium">Workouts</span>
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive("/profile") ? "bg-[#E8F5E9] text-[#28A745]" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className={`${isActive("/profile") ? "text-[#28A745]" : "text-gray-500"} mr-3`}>
                  <FaUser className="text-xl" />
                </span>
                <span className="font-medium">Profile</span>
              </Link>
            </li>

            <li>
              <Link
                to="/reports"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive("/reports") ? "bg-[#E8F5E9] text-[#28A745]" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className={`${isActive("/reports") ? "text-[#28A745]" : "text-gray-500"} mr-3`}>
                  <FaRegStickyNote className="text-xl" />
                </span>
                <span className="font-medium">Weekly Report</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-800 md:hidden focus:outline-none">
            <FaBars className="h-6 w-6" />
          </button>

          <div className="ml-4 md:ml-0 flex-1 flex items-center justify-between">
            <div className="relative max-w-md w-full hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745]"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Logout Button in Header */}
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
              title="Logout"
            >
              <FaSignOutAlt className="text-gray-500 mr-2" />
              <span className="font-medium hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout
