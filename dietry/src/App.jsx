import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Track from './components/Track';
import { useState, useEffect } from 'react';
import Private from './components/Private';
import { UserContext } from './contexts/UserContext';
import UserDetails from './components/userDetails';
import Home from './components/home';


function App() {
  // Use sessionStorage to manage user session
  const [loggedUser, setLoggedUser] = useState(JSON.parse(sessionStorage.getItem('diet-user')));

  // Determine if the user has provided all necessary details
  const hasDetails =
    loggedUser &&
    loggedUser.height &&
    loggedUser.weight &&
    loggedUser.gender &&
    loggedUser.activityLevel &&
    loggedUser.goal;

  useEffect(() => {
    // If a user is logged in but their details are incomplete, force them to fill them out
    if (loggedUser && !hasDetails) {
      window.location.href = "/details";
    }
  }, [loggedUser, hasDetails]);

  return (
    <UserContext.Provider value={{ loggedUser, setLoggedUser }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route
            path='/track'
            element={hasDetails ? <Private Component={Track} /> : <Navigate to="/details" />}
          />
          <Route path='/details' element={<UserDetails />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
