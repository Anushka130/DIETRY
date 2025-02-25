import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';


export default function UserDetails() {
    const { setLoggedUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [userDetails, setUserDetails] = useState({
        height: '',
        weight: '',
        gender: '',
        activityLevel: '',
        goal: ''
    });

    const [message, setMessage] = useState({ type: "invisible", text: "" });

    function handleInput(event) {
        setUserDetails(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        const token = JSON.parse(sessionStorage.getItem("diet-user")).token;

        fetch("http://127.0.0.1:5000/user-details", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userDetails)
        })
        .then(response => response.json())
        .then(data => {
            setMessage({ type: "success", text: data.message });

            // Update session storage to mark details as completed
            let storedUser = JSON.parse(sessionStorage.getItem("diet-user"));
            storedUser = { ...storedUser, ...userDetails, hasDetails: true };
            sessionStorage.setItem("diet-user", JSON.stringify(storedUser));
            setLoggedUser(storedUser);

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        })
        .catch(error => {
            setMessage({ type: "error", text: "Failed to update details" });
            console.error(error);
        });
    }

    return (
        <section className="container">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Complete Your Profile</h1>
                <input className="inp" type="number" name="height" placeholder="Height (cm)" value={userDetails.height} onChange={handleInput} required />
                <input className="inp" type="number" name="weight" placeholder="Weight (kg)" value={userDetails.weight} onChange={handleInput} required />
                <select className="inp" name="gender" value={userDetails.gender} onChange={handleInput} required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <select className="inp" name="activityLevel" value={userDetails.activityLevel} onChange={handleInput} required>
                    <option value="">Select Activity Level</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light Activity</option>
                    <option value="moderate">Moderate Activity</option>
                    <option value="active">Very Active</option>
                </select>
                <select className="inp" name="goal" value={userDetails.goal} onChange={handleInput} required>
                    <option value="">Select Goal</option>
                    <option value="lose_weight">Lose Weight</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain_muscle">Gain Muscle</option>
                </select>
                <button className="btn">Save Details</button>
                <p className={message.type}>{message.text}</p>
            </form>
        </section>
    );
}
