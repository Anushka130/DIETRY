"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState, useContext, useEffect } from "react"
import { UserContext } from "../contexts/UserContext"

export default function Login() {
  const { setLoggedUser } = useContext(UserContext)
  const navigate = useNavigate()
  const [userCred, setUserCred] = useState({ email: "", password: "" })
  const [message, setMessage] = useState({ type: "invisible-msg", text: "Dummy-msg" })

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("diet-user"))
    if (storedUser && storedUser.token) {
      if (storedUser.hasDetails) {
        navigate("/track")
      } else {
        navigate("/details")
      }
    }
  }, [navigate])

  function handleInput(event) {
    setUserCred((prevState) => ({ ...prevState, [event.target.name]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    fetch("http://127.0.0.1:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userCred),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          sessionStorage.setItem("diet-user", JSON.stringify(data))
          setLoggedUser(data)

          if (!data.hasDetails) {
            navigate("/details")
          } else if (!data.hasAllergyInfo) {
            navigate("/allergy-selection")
          } else {
            navigate("/track")
          }
        } else {
          setMessage({ type: "error", text: data.message })
        }
      })
      .catch((err) => console.error(err))
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#E8F5E9] to-[#A5D6A7] text-[#004D40] py-8">
      <div className="bg-white p-6 rounded-3xl shadow-lg w-[350px] h-[350px] max-w-md">
        <form className="flex flex-col  items-center" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold text-[#004D40] mb-6 text-center">Start Your Fitness</h1>

          <div className="w-full space-y-8">
            <input
              className="w-full px-4 py-3 border border-[#28A745] rounded-full text-base outline-none transition-all duration-300 focus:border-[#FF9800] focus:shadow-[0_0_6px_rgba(255,152,0,0.5)]"
              required
              type="email"
              onChange={handleInput}
              placeholder="Enter Your email"
              name="email"
              value={userCred.email}
            />

            <input
              className="w-full px-4 py-3 border border-[#28A745] rounded-full text-base outline-none transition-all duration-300 focus:border-[#FF9800] focus:shadow-[0_0_6px_rgba(255,152,0,0.5)]"
              required
              type="password"
              onChange={handleInput}
              placeholder="Enter Your password"
              name="password"
              value={userCred.password}
            />

            <button className="w-full py-3 border-none rounded-full text-base font-bold cursor-pointer transition-all duration-300 bg-[#a7dfa2] hover:bg-[#52af67] hover:text-white">
              Login
            </button>
          </div>

          {message.type !== "invisible-msg" && (
            <div
              className={`mt-4 p-2 rounded ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
            >
              {message.text}
            </div>
          )}

          <p className="mt-7 text-center ">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-[#FF9800] font-bold no-underline transition-all duration-300 hover:underline"
            >
              Sign-up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
