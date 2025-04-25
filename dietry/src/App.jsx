"use client"

/* eslint-disable react/prop-types */
import "./App.css"
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Register from "./components/Register"
import Login from "./components/Login"
import Track from "./components/Track"
import Private from "./components/Private"
import { UserContext } from "./contexts/UserContext"
import UserDetails from "./components/UserDetails"
import AllergySelection from "./components/AllergySelection"
import Home from "./components/Home"
import Sidebar from "./components/sidebar/Sidebar"
import Dashboard from "./components/Dashboard/Dashboard"
import FoodDiary from "./components/Food/FoodDiary"
import Workout from "./components/Workout/Workout"
import WorkoutPlanDetail from "./components/Workout/WorkoutPlanDetail"
import CreateWorkoutPlan from "./components/Workout/CreateWorkoutPlan"
import WorkoutPlanList from "./components/Workout/WorkoutPlanList"

function App() {
  const [loggedUser, setLoggedUser] = useState(JSON.parse(sessionStorage.getItem("diet-user")))

  return (
    <UserContext.Provider value={{ loggedUser, setLoggedUser }}>
      <BrowserRouter>
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="colored"
        />
        <AppRoutes loggedUser={loggedUser} />
      </BrowserRouter>
    </UserContext.Provider>
  )
}

function AppRoutes({ loggedUser }) {
  const location = useLocation()
  const navigate = useNavigate()

  const hasDetails =
    loggedUser &&
    loggedUser.height &&
    loggedUser.weight &&
    loggedUser.gender &&
    loggedUser.activityLevel &&
    loggedUser.goal

  const hasAllergyInfo = loggedUser && loggedUser.hasAllergyInfo

  useEffect(() => {
    if (loggedUser) {
      if (!hasDetails && location.pathname !== "/details") {
        navigate("/details")
      } else if (hasDetails && !hasAllergyInfo && location.pathname !== "/allergy-selection") {
        navigate("/allergy-selection")
      }
    }
  }, [loggedUser, hasDetails, hasAllergyInfo, location.pathname, navigate])

  // Check if the current route should display the sidebar layout
  const shouldShowSidebar =
    [
      "/dashboard",
      "/track",
      "/food/diary",
      "/food/breakfast",
      "/food/lunch",
      "/food/dinner",
      "/food/snacks",
      "/food/water",
      "/nutrition",
      "/workout", // Add this route to support the old link
    ].includes(location.pathname) && loggedUser

  if (shouldShowSidebar) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={true} />
        <div className="flex-1 ml-64 transition-all duration-300">
          <Routes>
            <Route path="/dashboard" element={<Private Component={() => <Dashboard isOpen={true} />} />} />
            <Route path="/overview" element="track" />
            <Route path="/track" element={hasDetails ? <Private Component={Track} /> : <Navigate to="/details" />} />

            {/* Food routes */}
            <Route
              path="/food/diary"
              element={hasDetails ? <Private Component={FoodDiary} /> : <Navigate to="/details" />}
            />
            <Route
              path="/food/breakfast"
              element={hasDetails ? <Private Component={FoodDiary} /> : <Navigate to="/details" />}
            />
            <Route
              path="/food/lunch"
              element={hasDetails ? <Private Component={FoodDiary} /> : <Navigate to="/details" />}
            />
            <Route
              path="/food/dinner"
              element={hasDetails ? <Private Component={FoodDiary} /> : <Navigate to="/details" />}
            />
            <Route
              path="/food/snacks"
              element={hasDetails ? <Private Component={FoodDiary} /> : <Navigate to="/details" />}
            />
            <Route
              path="/food/water"
              element={hasDetails ? <Private Component={FoodDiary} /> : <Navigate to="/details" />}
            />

            {/* Add a redirect from the old nutrition path to the new food diary path */}
            <Route path="/nutrition" element={<Navigate to="/food/diary" replace />} />
          
            {/* Workout routes */}
        <Route path="/workout" element={hasDetails ? <Private Component={Workout} /> : <Navigate to="/details" />}/>
          </Routes>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/track" element={hasDetails ? <Private Component={Track} /> : <Navigate to="/details" />} />
      <Route path="/details" element={<UserDetails />} />
      <Route path="/allergy-selection" element={<AllergySelection />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
