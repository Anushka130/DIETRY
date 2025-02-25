import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';

export default function Login() {
  const { setLoggedUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [userCred, setUserCred] = useState({ email: '', password: '' });
  const [message, setMessage] = useState({ type: 'invisible-msg', text: "Dummy-msg" });

  // On mount, check if user session exists and redirect accordingly
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("diet-user"));
    if (storedUser && storedUser.token) {
      if (storedUser.hasDetails) {
        navigate('/home'); // Redirect to home if details exist
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
      body: JSON.stringify(userCred),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          // Check if user details already exist
          const hasDetails =
            data.height &&
            data.weight &&
            data.gender &&
            data.activityLevel &&
            data.goal;

          // Save user data in sessionStorage
          sessionStorage.setItem("diet-user", JSON.stringify({ ...data, hasDetails }));
          setLoggedUser({ ...data, hasDetails });

          if (hasDetails) {
            navigate('/home'); // Go to home if details exist
          } else {
            navigate('/details'); // Go to details only first time
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
        <p className={message.type}>{message.text}</p>
      </form>
    </section>
  );
}
