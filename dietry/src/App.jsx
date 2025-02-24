import './App.css'
import { BrowserRouter, Routes, Route, } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Track from './components/Track'
import { useState } from 'react'
import Private from './components/Private'


import { UserContext } from './contexts/UserContext'

function App() {

 const [loggedUser, setLoggedUser] = useState(localStorage.getItem('diet-user'));
 



  return (
  <>


  
    <UserContext.Provider value={{loggedUser, setLoggedUser}}>
      
      <BrowserRouter>
    
      
         <Routes>
           <Route path='/' element={<Login/>}/>
           <Route path='/register' element={<Register/>}/>
           <Route path='/track' element={<Private Component={Track}/>}/>
           <Route path='/login' element={<Login/>}/>
          
          </Routes>
     
      </BrowserRouter>
      </UserContext.Provider>




  </>
  )
}

export default App
