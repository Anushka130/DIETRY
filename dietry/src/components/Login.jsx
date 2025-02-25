import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';

export default function Login() {
  const { setLoggedUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [userCred, setUserCred] = useState({ email: '', password: '' });
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState({ type: 'invisible-msg', text: "Dummy-msg" });

  // On mount, check if user session exists and redirect accordingly
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("diet-user"));
    if (storedUser && storedUser.token) {
      if (storedUser.hasDetails) {
        navigate('/track'); // Redirect to home if details exist
      } else {
        navigate('/details'); // Redirect to details if first-time login
      }
    }
  }, [navigate]);

  function handleInput(event) {
    setUserCred(prevState => ({ ...prevState, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
  
    fetch("http://127.0.0.1:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userCred),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          sessionStorage.setItem("diet-user", JSON.stringify(data));
          setLoggedUser(data);
  
          if (!data.hasDetails) {
            navigate("/details");
          } else if (!data.hasAllergyInfo) {
            navigate("/allergy-selection");
          } else {
            navigate("/track");
          }
        } else {
          setMessage({ type: "error", text: data.message });
        }
      })
      .catch(err => console.error(err));
  }
  

  return (
    <section className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Start Your Fitness</h1>
        <input className="inp" required type="email" onChange={handleInput} placeholder="Enter Your email" name="email" value={userCred.email} />
        <input className="inp" required type="password" onChange={handleInput} placeholder="Enter Your password" name="password" value={userCred.password} />
        <button className="btn">Login</button>
        <p>Don&apos;t have an account? <Link to='/register'>Sign-up</Link></p>
      </form>
    </section>
  );
}
