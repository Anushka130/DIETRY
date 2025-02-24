import { UserContext } from "../contexts/UserContext"
import { useContext } from "react"
import Header from "./Header";


export default function Track() 
    {

        const loggedData = useContext(UserContext)
        function searchFood(event)
        {
            fetch('http://localhost:3000/foods/${event.target.value}',
            { 
                method: "GET",
                headers:
                {
                    "Authorization": "Bearer"+ loggedData.loggedUser.token
                }
            })
              .then((response)=>response.json())
              .then((data)=>{
                  console.log(data);
                })
              .catch((err)=>{
                 console.log(err);
                 })
        } 




        return(
            <>
            <Header/>
            <section className="container track-container">
               
               <div className="search">
                <input className="search-inp" onChange={searchFood}
                 type="search" placeholder="Search Food Items"/>

               </div>
                
            </section>
            </>
        )
    }