import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';

export default function Home() {
  const { setLoggedUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("diet-user"));
    if (!storedUser || !storedUser.token) {
    }
  }, [setLoggedUser]);

  function handleLogout() {
    sessionStorage.removeItem("diet-user"); // Clear session storage
    setLoggedUser(null); // Reset user context
    navigate('/login'); // Redirect to login page
  }

  return (
    <>
      <header className="navbar">
        <h1>DIETRY</h1>

        {/* LogInButton */}
      <button className="btn login-btn" onClick={() => navigate('/login')}>
         Login
     </button>
      </header>
    <section className='hero'>
      <image src="" atl="" className='hero-image'/>
      <div className='hero-content'>
      <h2>START YOUR FITNESS JOURNEY</h2>
      <p>Get yor personalized meal plan for healthy living</p>
      <button className='btn hero-btn' onClick={() => navigate('/login')}GET STARTED>

      </button>
      </div>
    </section>
    </>
  );
}
