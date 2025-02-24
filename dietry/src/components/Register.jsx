import { Link } from 'react-router-dom';
import { useState } from 'react';


export default function Register() {

  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    password: '',
    age: ''
  });
   const [message, setMessage] = useState({
         type:"invisible",
         text:""
   });

  function handleInput(event) {
    
    setUserDetails((prevState) =>{
        return{...prevState, [event.target.name]: event.target.value};
    })
    
  }
  function handleSubmit(event) {

    // console.log(userDetails);
    event.preventDefault();

   fetch("http://localhost:3000/register",{
    method:"POST",
    body: JSON.stringify(userDetails),
    headers: {
      'Content-Type': 'application/json'
    }
  
  })
  .then((response)=>response.json())
  .then((data)=>{

     setMessage({type:"success", text:data.message})

     setUserDetails({
      name: '',
      email: '',
      password: '',
      age:''
     })

     setTimeout(()=>{
          setMessage({type:"invisible-msg", text:"Dummy msg"})
     }, 5000)
  }
    )
  .catch((error)=>{
    console.log(error);
  })



  }
  return (

      <section className="container">
         <form className="form" onSubmit={handleSubmit}>
          <h1>Register for Fitness</h1>
          
             <input className="inp" type="text" required onChange={handleInput}            
              placeholder="Enter Your name" name="name" value={userDetails.name}/>
            
             <input className="inp" type="email" required onChange={handleInput}
             placeholder="Enter Your email" name="email" value={userDetails.email} />
            
             <input className="inp" type="password" maxLength={10} onChange={handleInput}
              placeholder="Enter Your password" name="password" value={userDetails.password} />
             
             <input className="inp" min={10} max={100} type="number" onChange={handleInput}
             placeholder="Enter Your age" name="age" value={userDetails.age} />
             
             <button className="btn">Register</button>

              <p>Already have an account? 
                <Link to='/login'>Login</Link>
              </p>
        
              <p className={message.type}>{message.text}</p>
            
        </form>
    </section>
  )
}