/* eslint-disable react/prop-types */
import "./App.css";
import { BrowserRouter,Routes, Route, Navigate, useLocation, Router,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Track from "./components/Track";
import { useState, useEffect } from "react";
import Private from "./components/Private";
import { UserContext } from "./contexts/UserContext";
import UserDetails from "./components/UserDetails";
import AllergySelection from "./components/AllergySelection"; // Import allergy page
import Home from "./components/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";




function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(sessionStorage.getItem("diet-user"))

    
  );

  return (
    <UserContext.Provider value={{ loggedUser, setLoggedUser }}>
      <BrowserRouter>
        {/* Improved Toast Notification Settings */}
        <ToastContainer
          position="top-center"
          autoClose={1000} // 1 second
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="colored"
        />
        <AppRoutes loggedUser={loggedUser} 
        setLoggedUser={setLoggedUser}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar} />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

// Moved routing logic into a separate component
function AppRoutes({ loggedUser, isSidebarOpen, toggleSidebar }) {
  const location = useLocation();

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
        window.location.href = "/details";
      } else if (
        hasDetails &&
        !hasAllergyInfo &&
        location.pathname !== "/allergy-selection"
      ) {
        window.location.href = "/allergy-selection";
      }
    }
  }, [loggedUser, hasDetails, hasAllergyInfo, location.pathname]);

  const isDashboardRoute = ["/dashboard", "/track"].includes(location.pathname)&& loggedUser

  if(isDashboardRoute) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
          <Routes>
            <Route
              path="/dashboard"
              element={<Private Component={() => <Dashboard isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />} />}
            />
            <Route path="/track" element={hasDetails ? <Private Component={Track} /> : <Navigate to="/details" />} />
          </Routes>
        </div>
      </div>
    )
  }


  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/track"
        element={
          hasDetails ? (
            <Private Component={Track} />
          ) : (
            <Navigate to="/details" />
          )
        }
      />
      <Route path="/track" element={<Track />} />
      <Route path="/details" element={<UserDetails />} />
      <Route path="/allergy-selection" element={<AllergySelection />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    


  );
}

export default App;
