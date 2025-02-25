/* eslint-disable react/prop-types */
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
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

function App() {
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
        <AppRoutes loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

// Moved routing logic into a separate component
function AppRoutes({ loggedUser }) {
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

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/home"
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
