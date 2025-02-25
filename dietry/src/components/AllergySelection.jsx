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
    updateAllergy(""); // Save as empty and mark as completed
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

        navigate("/home"); // Redirect to home after skipping or submitting
      })
      .catch((error) => console.error("Error updating allergies:", error));
  }

  return (
    <section className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Do you have any allergies?</h1>
        <textarea
          className="inp allergy-box" /* Applied class for bigger input */
          placeholder="Enter allergies (optional)"
          value={allergy}
          onChange={(e) => setAllergy(e.target.value)}
        ></textarea>
        <button className="btn primary">Save & Continue</button>
      </form>
      
      <button className="btn secondary" onClick={skipAllergy}>Skip</button>
    </section>
  );
}
