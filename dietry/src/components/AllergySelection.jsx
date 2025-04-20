import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export default function AllergySelection() {
  const { setLoggedUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [allergy, setAllergy] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    updateAllergy(allergy);
  }

  function skipAllergy() {
    updateAllergy("");
  }

  function updateAllergy(allergyValue) {
    const token = JSON.parse(sessionStorage.getItem("diet-user")).token;

    fetch("http://localhost:3000/update-allergy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ allergy: allergyValue, hasAllergyInfo: true }),
    })
      .then((response) => response.json())
      .then((data) => {
        let storedUser = JSON.parse(sessionStorage.getItem("diet-user"));
        storedUser.allergy = allergyValue;
        storedUser.hasAllergyInfo = true;
        sessionStorage.setItem("diet-user", JSON.stringify(storedUser));
        setLoggedUser(storedUser);

        navigate("/track");
      })
      .catch((error) => console.error("Error updating allergies:", error));
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#E8F5E9] to-[#A5D6A7] text-[#004D40] pt-[70px]">
      <form className="bg-white p-6 rounded-xl shadow-lg w-[350px] text-center" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-[#004D40] mb-4">Do you have any allergies?</h1>
        <textarea
          className="w-full p-4 border-2 border-[#28A745] rounded-lg text-base outline-none transition-all duration-300 mb-4 h-[80px] focus:border-[#FF9800] focus:shadow-[0_0_6px_rgba(255,152,0,0.5)] resize-none"
          placeholder="Enter allergies (optional)"
          value={allergy}
          onChange={(e) => setAllergy(e.target.value)}
        ></textarea>
        <button className="w-full p-3 mt-2 border-none rounded-lg text-base font-bold cursor-pointer transition-all duration-300 bg-[#28A745] text-white hover:bg-[#218838]">
          Save & Continue
        </button>
      </form>
      
      <button 
        className="w-[40%] p-2 mt-4 border-none rounded text-sm font-bold cursor-pointer transition-all duration-300 bg-[#FF9800] text-white hover:bg-[#FB8C00]"
        onClick={skipAllergy}
      >
        Skip
      </button>
    </div>
  );
}