import { UserContext } from "../contexts/UserContext"
import { useContext,useEffect } from "react"
import { useNavigate } from "react-router-dom"


export default function Home() {
  const { setLoggedUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("diet-user"));
    if (!storedUser || !storedUser.token) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [navigate]);

  function handleLogout() {
    sessionStorage.removeItem("diet-user"); // Clear session storage
    setLoggedUser(null); // Reset user context
    navigate('/'); // Redirect to login page
  }

  return (
    <section className="container">
      <h1>Welcome to the Home Page</h1>
      <p>This is a dummy home page text. Feel free to customize it.</p>
       
      {/* Logout Button */}
      <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
    </section>
  );
}
