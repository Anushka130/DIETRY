"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  FaHome,
  FaUser,
  FaFileAlt,
  FaChevronRight,
  FaChevronDown,
  FaUtensils,
  FaAppleAlt,
  FaCoffee,
  FaCarrot,
  FaCookieBite,
  FaGlassWhiskey,
  FaRegStickyNote,
  FaSignOutAlt,
} from "react-icons/fa"

const Sidebar = () => {
  const navigate = useNavigate()
  const [foodMenuOpen, setFoodMenuOpen] = useState(false)

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?")
    if (confirmLogout) {
      sessionStorage.removeItem("diet-user")
      navigate("/")
    }
  }

  return (
    <div className="w-64 bg-white h-screen fixed border-r border-gray-200 z-10 flex flex-col">
      {/* Top Section: Branding */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <span className="ml-2 text-xl font-bold text-[#004D40]">Dietry</span>
      </div>

      {/* Middle Scrollable Section */}
      <div className="flex-1 overflow-y-auto">
        <nav className="mt-4">
          <ul>
            <li>
              <Link to="/dashboard" className="flex items-center px-4 py-3 text-[#004D40] hover:bg-[#E8F5E9] rounded-lg mx-2 font-medium">
                <FaHome className="mr-4 text-[#28A745]" />
                <span>Overview</span>
              </Link>
            </li>
            <li>
              <Link to="/profile" className="flex items-center px-4 py-3 text-[#004D40] hover:bg-[#E8F5E9] rounded-lg mx-2 font-medium">
                <FaUser className="mr-4 text-[#28A745]" />
                <span>Personal</span>
              </Link>
            </li>
            <li>
              <Link to="/workout" className="flex items-center px-4 py-3 text-[#004D40] hover:bg-[#E8F5E9] rounded-lg mx-2 font-medium">
                <FaFileAlt className="mr-4 text-[#28A745]" />
                <div className="flex items-center justify-between w-full">
                  <span>Workout Plans</span>
                  <FaChevronRight className="text-gray-400 text-xs" />
                </div>
              </Link>
            </li>
            <li>
              <div onClick={() => setFoodMenuOpen(!foodMenuOpen)} className="flex items-center px-4 py-3 text-[#004D40] hover:bg-[#E8F5E9] rounded-lg mx-2 font-medium cursor-pointer">
                <FaUtensils className="mr-4 text-[#28A745]" />
                <div className="flex items-center justify-between w-full">
                  <span>Foods</span>
                  {foodMenuOpen ? <FaChevronDown className="text-gray-400 text-xs" /> : <FaChevronRight className="text-gray-400 text-xs" />}
                </div>
              </div>

              {foodMenuOpen && (
                <ul className="ml-8 mt-1">
                  <li><Link to="/food/diary" className="flex items-center px-4 py-2 text-gray-600 hover:bg-[#E8F5E9] rounded-lg"><FaAppleAlt className="mr-3 text-[#28A745] text-sm" /><span>Food Diary</span></Link></li>
                  <li><Link to="/food/breakfast" className="flex items-center px-4 py-2 text-gray-600 hover:bg-[#E8F5E9] rounded-lg"><FaCoffee className="mr-3 text-[#28A745] text-sm" /><span>Breakfast</span></Link></li>
                  <li><Link to="/food/lunch" className="flex items-center px-4 py-2 text-gray-600 hover:bg-[#E8F5E9] rounded-lg"><FaUtensils className="mr-3 text-[#28A745] text-sm" /><span>Lunch</span></Link></li>
                  <li><Link to="/food/dinner" className="flex items-center px-4 py-2 text-gray-600 hover:bg-[#E8F5E9] rounded-lg"><FaCarrot className="mr-3 text-[#28A745] text-sm" /><span>Dinner</span></Link></li>
                  <li><Link to="/food/snacks" className="flex items-center px-4 py-2 text-gray-600 hover:bg-[#E8F5E9] rounded-lg"><FaCookieBite className="mr-3 text-[#28A745] text-sm" /><span>Snacks</span></Link></li>
                  
                </ul>
              )}
            </li>
            <li>
              <Link to="/reports" className="flex items-center px-4 py-3 text-[#004D40] hover:bg-[#E8F5E9] rounded-lg mx-2 font-medium">
                <FaRegStickyNote className="mr-4 text-[#28A745]" />
                <span>Weekly Report</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom: Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200 rounded-lg font-medium"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
