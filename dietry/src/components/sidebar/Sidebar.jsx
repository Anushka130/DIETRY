"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
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
} from "react-icons/fa"

const Sidebar = () => {
  const [foodMenuOpen, setFoodMenuOpen] = useState(false)

  return (
    <div className="w-64 bg-white h-screen fixed border-r border-gray-200 z-10">
      <div className="flex items-center p-4 border-b border-gray-200">
        <span className="ml-2 text-xl font-bold text-[#004D40]">DIETRY</span>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-64px)]">
        <nav className="mt-4">
          <ul>
            <li>
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-3 text-[#004D40] hover:bg-[#E8F5E9] rounded-lg mx-2 font-medium"
              >
                <FaHome className="mr-4 text-[#28A745]" />
                <span>Overview</span>
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center px-4 py-3 text-[#004D40] hover:bg-[#E8F5E9] rounded-lg mx-2 font-medium"
              >
                <FaUser className="mr-4 text-[#28A745]" />
                <span>Personal</span>
              </Link>
            </li>
            <li>
              <Link
                to="/plans"
                className="flex items-center px-4 py-3 text-[#004D40] hover:bg-[#E8F5E9] rounded-lg mx-2 font-medium"
              >
                <FaFileAlt className="mr-4 text-[#28A745]" />
                <div className="flex items-center justify-between w-full">
                  <span>Workout Plans</span>
                  <FaChevronRight className="text-gray-400 text-xs" />
                </div>
              </Link>
            </li>
            <li>
              <div
                className="flex items-center px-4 py-3 text-[#004D40] hover:bg-[#E8F5E9] rounded-lg mx-2 font-medium cursor-pointer"
                onClick={() => setFoodMenuOpen(!foodMenuOpen)}
              >
                <FaUtensils className="mr-4 text-[#28A745]" />
                <div className="flex items-center justify-between w-full">
                  <span>Food</span>
                  {foodMenuOpen ? (
                    <FaChevronDown className="text-gray-400 text-xs" />
                  ) : (
                    <FaChevronRight className="text-gray-400 text-xs" />
                  )}
                </div>
              </div>

              {/* Food Submenu */}
              {foodMenuOpen && (
                <ul className="ml-8 mt-1">
                  <li>
                    <Link
                      to="/food/diary"
                      className="flex items-center px-4 py-2 text-gray-600 hover:bg-[#E8F5E9] rounded-lg"
                    >
                      <FaAppleAlt className="mr-3 text-[#28A745] text-sm" />
                      <span>Food Diary</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/food/breakfast"
                      className="flex items-center px-4 py-2 text-gray-600 hover:bg-[#E8F5E9] rounded-lg"
                    >
                      <FaCoffee className="mr-3 text-[#28A745] text-sm" />
                      <span>Breakfast</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/food/lunch"
                      className="flex items-center px-4 py-2 text-gray-600 hover:bg-[#E8F5E9] rounded-lg"
                    >
                      <FaUtensils className="mr-3 text-[#28A745] text-sm" />
                      <span>Lunch</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/food/dinner"
                      className="flex items-center px-4 py-2 text-gray-600 hover:bg-[#E8F5E9] rounded-lg"
                    >
                      <FaCarrot className="mr-3 text-[#28A745] text-sm" />
                      <span>Dinner</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/food/snacks"
                      className="flex items-center px-4 py-2 text-gray-600 hover:bg-[#E8F5E9] rounded-lg"
                    >
                      <FaCookieBite className="mr-3 text-[#28A745] text-sm" />
                      <span>Snacks</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/food/water"
                      className="flex items-center px-4 py-2 text-gray-600 hover:bg-[#E8F5E9] rounded-lg"
                    >
                      <FaGlassWhiskey className="mr-3 text-[#28A745] text-sm" />
                      <span>Water</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
            <Link
                to="/reports"
                className="flex items-center px-4 py-3 text-[#004D40] hover:bg-[#E8F5E9] rounded-lg mx-2 font-medium"
              >
                <FaRegStickyNote className="mr-4 text-gray-500" />
                <span>Weekly Report</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
