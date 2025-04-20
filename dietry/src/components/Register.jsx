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

    fetch("http://127.0.0.1:3000/register", {
      method: "POST",
      body: JSON.stringify(userDetails),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(data.message);
        setUserDetails({
          name: "",
          email: "",
          password: "",
          age: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Registration failed");
      });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#E8F5E9] to-[#A5D6A7] text-[#004D40] pt-[70px]">
      <form className="bg-white p-6 rounded-xl shadow-lg w-[350px] text-center" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-[#004D40] mb-4">Register for Fitness</h1>
        <input
          className="w-full p-4 border-2 border-[#28A745] rounded-lg text-base outline-none transition-all duration-300 mb-4 h-[50px] focus:border-[#FF9800] focus:shadow-[0_0_6px_rgba(255,152,0,0.5)]"
          type="text"
          required
          onChange={handleInput}
          placeholder="Enter Your name"
          name="name"
          value={userDetails.name}
        />
        <input
          className="w-full p-4 border-2 border-[#28A745] rounded-lg text-base outline-none transition-all duration-300 mb-4 h-[50px] focus:border-[#FF9800] focus:shadow-[0_0_6px_rgba(255,152,0,0.5)]"
          type="email"
          required
          onChange={handleInput}
          placeholder="Enter Your email"
          name="email"
          value={userDetails.email}
        />
        <input
          className="w-full p-4 border-2 border-[#28A745] rounded-lg text-base outline-none transition-all duration-300 mb-4 h-[50px] focus:border-[#FF9800] focus:shadow-[0_0_6px_rgba(255,152,0,0.5)]"
          type="password"
          maxLength={10}
          onChange={handleInput}
          placeholder="Enter Your password"
          name="password"
          value={userDetails.password}
        />
        <input
          className="w-full p-4 border-2 border-[#28A745] rounded-lg text-base outline-none transition-all duration-300 mb-4 h-[50px] focus:border-[#FF9800] focus:shadow-[0_0_6px_rgba(255,152,0,0.5)]"
          min={10}
          max={100}
          type="number"
          onChange={handleInput}
          placeholder="Enter Your age"
          name="age"
          value={userDetails.age}
        />
        <button className="w-full p-3 mt-2 border-none rounded-lg text-base font-bold cursor-pointer transition-all duration-300 bg-[#a7dfa2] hover:bg-[#28A745] hover:text-white">
          Register
        </button>
        <p className="mt-4">
          Already have an account? <Link to="/login" className="text-[#FF9800] font-bold no-underline transition-all duration-300 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}