"use client"

import { Link } from "react-router-dom"
import {
  FaHome,
  FaUser,
  FaFileAlt,
  FaComments,
  FaRobot,
  FaBlog,
  FaCreditCard,
  FaBullhorn,
  FaBars,
  FaChevronRight,
} from "react-icons/fa"

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-white h-screen fixed transition-all duration-300 border-r border-gray-200 z-10`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <img src="/logo.svg" alt="FitTrack Logo" className="h-8 w-8" />
          {isOpen && <span className="ml-2 text-xl font-bold text-[#004D40]">FitTrack</span>}
        </div>
        <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-100 lg:hidden">
          <FaBars className="text-gray-500" />
        </button>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-64px)]">
        <nav className="mt-4">
          <ul>
            <li>
              <Link
                to="/"
                className="flex items-center px-4 py-3 text-[#004D40] hover:bg-[#E8F5E9] rounded-lg mx-2 font-medium"
              >
                <FaHome className={`${isOpen ? "mr-4" : "mx-auto"} text-[#28A745]`} />
                {isOpen && <span>Overview</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-[#E8F5E9] rounded-lg mx-2"
              >
                <FaUser className={`${isOpen ? "mr-4" : "mx-auto"} text-gray-500`} />
                {isOpen && <span>Personal</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/plans"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-[#E8F5E9] rounded-lg mx-2"
              >
                <FaFileAlt className={`${isOpen ? "mr-4" : "mx-auto"} text-gray-500`} />
                {isOpen && (
                  <div className="flex items-center justify-between w-full">
                    <span>Workout Plans</span>
                    <FaChevronRight className="text-gray-400 text-xs" />
                  </div>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/nutrition"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-[#E8F5E9] rounded-lg mx-2"
              >
                <FaComments className={`${isOpen ? "mr-4" : "mx-auto"} text-gray-500`} />
                {isOpen && (
                  <div className="flex items-center justify-between w-full">
                    <span>Nutrition Plans</span>
                    <FaChevronRight className="text-gray-400 text-xs" />
                  </div>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/ai-coach"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-[#E8F5E9] rounded-lg mx-2"
              >
                <FaRobot className={`${isOpen ? "mr-4" : "mx-auto"} text-gray-500`} />
                {isOpen && (
                  <div className="flex items-center justify-between w-full">
                    <span>AI Coach</span>
                    <FaChevronRight className="text-gray-400 text-xs" />
                  </div>
                )}
              </Link>
            </li>
            <li>
              <Link to="/blog" className="flex items-center px-4 py-3 text-gray-600 hover:bg-[#E8F5E9] rounded-lg mx-2">
                <FaBlog className={`${isOpen ? "mr-4" : "mx-auto"} text-gray-500`} />
                {isOpen && <span>Fitness Blog</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/subscription"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-[#E8F5E9] rounded-lg mx-2"
              >
                <FaCreditCard className={`${isOpen ? "mr-4" : "mx-auto"} text-gray-500`} />
                {isOpen && <span>Subscription</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/marketing"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-[#E8F5E9] rounded-lg mx-2"
              >
                <FaBullhorn className={`${isOpen ? "mr-4" : "mx-auto"} text-gray-500`} />
                {isOpen && <span>Referrals</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
