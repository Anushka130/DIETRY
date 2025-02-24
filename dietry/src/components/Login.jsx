import { Link, useNavigate} from 'react-router-dom';
import { useState, useContext} from 'react';
import { UserContext } from '../contexts/UserContext';



export default function Login() {

  const loggedData = useContext(UserContext);

  const navigate = useNavigate();

  const [userCred, setUserCred] = useState({
    email: '',
    password: ''
  })
    const[message,setMessage] = useState({
      type:'invisible-msg',
      text: "Dummy-msg"
     })

  function handleInput(event) {
    setUserCred((prevState) => ({
      ...prevState, [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {

    event.preventDefault();
    console.log(userCred);


    fetch("http://localhost:3000/login", {
      method: "POST",
      body: JSON.stringify(userCred),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((response) => {
        console.log(response);
        if(response.status === 404)
        {
          setMessage({type:"error", text:"Username or Email Doesn`t Exist"})
        }
        else if(response.status==403) 
        {
          setMessage({type:"error", text:"Password is incorrect"})
        }
      
      setTimeout(()=>{
        setMessage({type:"invisible-msg", text:"Dummy-msg"})
      },5000)

      return response.json();

      })

      .then((data) => {

        console.log(data);
        if(data.token!==undefined)
        {

           localStorage.setItem("diet-user", JSON.stringify(data));

           loggedData.setLoggedUser(data);
        
           navigate('/track');
        }
      })

      .catch((err) => {
        console.log(err);
      })

  }
  return (
  
    <section className="container">

       <form className="form" onSubmit={handleSubmit}>

         <h1>Start Your Fitness</h1> 
           
           <input className="inp"  required type="email" onChange={handleInput}
            placeholder="Enter Your email" name="email" value={userCred.email} />

           <input className="inp"  required type="password" onChange={handleInput}
           placeholder="Enter Your password" name="password" value={userCred.password} />
           
           <button className="btn">Login</button>

           <p>Doesn`t have an account?<Link to='/register'>Sign-up</Link></p>
            
            <p className={message.type}>{message.text}</p>

          </form>
  </section>
)
}