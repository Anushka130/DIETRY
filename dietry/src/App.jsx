/* eslint-disable react/prop-types */
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Register from "./components/Register";
import Login from "./components/Login";
import Track from "./components/Track";
import Private from "./components/Private";
import { UserContext } from "./contexts/UserContext";
import UserDetails from "./components/UserDetails";
import AllergySelection from "./components/AllergySelection";
import Home from "./components/Home";
import Sidebar from "./components/sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import FoodDiary from "./components/Food/FoodDiary";
import Workout from "./components/Workout/Workout";
import WorkoutPlanList from "./components/Workout/WorkoutPlanList";
import WorkoutPlanDetail from "./components/Workout/WorkoutPlanDetail";
import CreateWorkoutPlan from "./components/Workout/CreateWorkoutPlan";
import User from "./components/User";
import WorkoutHistory from "./components/Workout/WorkoutHistory";

function App() {
  const [loggedUser, setLoggedUser] = useState(JSON.parse(sessionStorage.getItem("diet-user")));

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
  );
}

function AppRoutes({ loggedUser }) {
  const location = useLocation();
  const navigate = useNavigate();

  const hasDetails =
    loggedUser &&
    loggedUser.height &&
    loggedUser.weight &&
    loggedUser.gender &&
    loggedUser.activityLevel &&
    loggedUser.goal;

  const hasAllergyInfo = loggedUser && loggedUser.hasAllergyInfo;

  useEffect(() => {
    if (loggedUser) {
      if (!hasDetails && location.pathname !== "/details") {
        navigate("/details");
      } else if (hasDetails && !hasAllergyInfo && location.pathname !== "/allergy-selection") {
        navigate("/allergy-selection");
      }
    }
  }, [loggedUser, hasDetails, hasAllergyInfo, location.pathname, navigate]);

  // Check if the current route should display the sidebar layout
  const sidebarRoutes = [
    "/dashboard",
    "/track",
    "/food/diary",
    "/food/breakfast",
    "/food/lunch",
    "/food/dinner",
    "/food/snacks",
    "/food/water",
    "/nutrition",
    "/workout",
    "/workout/create",
    "/workout/:id",
    "/profile",
  ];

  const shouldShowSidebar = sidebarRoutes.some(route => location.pathname.startsWith(route)) && loggedUser;

  if (shouldShowSidebar) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={true} />
        <div className="flex-1 ml-64 transition-all duration-300 overflow-y-auto">
          <Routes>
            {/* Dashboard and Track */}
            <Route path="/dashboard" element={<Private Component={() => <Dashboard isOpen={true} />} />} />
            <Route path="/track" element={hasDetails ? <Private Component={Track} /> : <Navigate to="/details" />} />
            <Route path="/overview" element="track" />

            {/* Food */}
            <Route path="/food/diary" element={<Private Component={FoodDiary} />} />
            <Route path="/food/breakfast" element={<Private Component={FoodDiary} />} />
            <Route path="/food/lunch" element={<Private Component={FoodDiary} />} />
            <Route path="/food/dinner" element={<Private Component={FoodDiary} />} />
            <Route path="/food/snacks" element={<Private Component={FoodDiary} />} />
            <Route path="/food/water" element={<Private Component={FoodDiary} />} />
            <Route path="/nutrition" element={<Navigate to="/food/diary" replace />} />

            {/* Workout Routes */}
            <Route path="/workout" element={<Private Component={Workout} />} />
            <Route path="/workout/create" element={<Private Component={CreateWorkoutPlan} />} />
            <Route path="/workout/:id" element={<Private Component={WorkoutPlanDetail} />} />
            <Route path="/workout/history" element={<Private Component={WorkoutHistory} />} />

            {/* Profile */}
            <Route path="/profile" element={<Private Component={User} />} />
          </Routes>
        </div>
      </div>
    );
  }

  // Public routes (without Sidebar)
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/details" element={<UserDetails />} />
      <Route path="/allergy-selection" element={<AllergySelection />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
