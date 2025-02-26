import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
  });

  const navigate = useNavigate();

  function handleInput(event) {
    setUserDetails((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    // Validate all fields
    if (!userDetails.name || !userDetails.email || !userDetails.password || !userDetails.age) {
      toast.error("All fields are required");
      return; // Prevent form submission
    }

    fetch("http://127.0.0.1:3000/register", {
      method: "POST",
      body: JSON.stringify(userDetails),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "User Registered") {
          toast.success(data.message); // Show success toast
          setUserDetails({
            name: "",
            email: "",
            password: "",
            age: "",
          });

          // Redirect to login page only if registration is successful
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          toast.error(data.message || "Registration failed"); // Handle errors
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Registration failed"); // Show error toast
      });
  }

  return (
    <section className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Register for Fitness</h1>
        <input
          className="inp"
          type="text"
          required
          onChange={handleInput}
          placeholder="Enter Your Name"
          name="name"
          value={userDetails.name}
        />
        <input
          className="inp"
          type="email"
          required
          onChange={handleInput}
          placeholder="Enter Your Email"
          name="email"
          value={userDetails.email}
        />
        <input
          className="inp"
          type="password"
          maxLength={10}
          required
          onChange={handleInput}
          placeholder="Enter Your Password"
          name="password"
          value={userDetails.password}
        />
        <input
          className="inp"
          min={10}
          max={100}
          type="number"
          required
          onChange={handleInput}
          placeholder="Enter Your Age"
          name="age"
          value={userDetails.age}
        />
        <button className="btn">Register</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}
