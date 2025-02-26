import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigate = useNavigate();
  return (
    <>
      <header className="navbar">
        <h1>DIETRY</h1>

        {/* LogInButton */}
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      </header>
      <section className="hero">
        <div className="hero-content">
          <h2>START YOUR FITNESS JOURNEY</h2>
          <p>Get yor personalized meal plan for healthy living</p>
          <button className="btn hero-btn" onClick={() => navigate("/login")}>
            GET STARTED
          </button>
        </div>
      </section>
    </>
  );
}
