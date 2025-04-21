"use client"

import { Link } from "react-router-dom"
import {
  FaHome,
  FaUser,
  FaFileAlt,
  FaComments,
  FaChevronRight,
} from "react-icons/fa"

const Sidebar = () => {
  return (
    <div className="w-64 bg-white h-screen fixed border-r border-gray-200 z-10">
      <div className="flex items-center p-4 border-b border-gray-200">
        
        <span className="ml-2 text-xl font-bold text-[#004D40]">Dietry</span>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-64px)]">
        <nav className="mt-4">
          <ul>
            <li>
              <Link
                to="/"
                className="flex items-center px-4 py-3 text-[#004D40] hover:bg-[#E8F5E9] rounded-lg mx-2 font-medium"
              >
                <FaHome className="mr-4 text-[#28A745]" />
                <span>Overview</span>
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-[#E8F5E9] rounded-lg mx-2"
              >
                <FaUser className="mr-4 text-gray-500" />
                <span>Personal</span>
              </Link>
            </li>
            <li>
              <Link
                to="/plans"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-[#E8F5E9] rounded-lg mx-2"
              >
                <FaFileAlt className="mr-4 text-gray-500" />
                <div className="flex items-center justify-between w-full">
                  <span>Workout Plans</span>
                  <FaChevronRight className="text-gray-400 text-xs" />
                </div>
              </Link>
            </li>
            <li>
              <Link
                to="/nutrition"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-[#E8F5E9] rounded-lg mx-2"
              >
                <FaComments className="mr-4 text-gray-500" />
                <div className="flex items-center justify-between w-full">
                  <span>Nutrition Plans</span>
                  <FaChevronRight className="text-gray-400 text-xs" />
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
