import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";


export default function Header() 
{
    
    const loggedData = useContext(UserContext);
    const navigate = useNavigate();


    function logout(){
        localStorage.removeItem("diet-users");
        loggedData.setLoggedUser(null);
        navigate("/login");

    }
    return(
        
        <div>
            <ul>Home</ul>
            <li onClick={logout}>Logout</li>
        </div>


    )
}