const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require ('cors');
require('dotenv').config();
 

const PORT = process.env.PORT || 5000;


//importing the userModel
 const userModel = require('./models/userModel');
 
 const foodModel = require('./models/foodModel');
 
 const verifyToken = require('./models/verifyToken');


//database connection
mongoose.connect('mongodb://localhost:27017/diet')
.then(() => {
    console.log('Database connection successful');
})
.catch((err) => {
    console.log(err);
})
 
const app = express();

app.use(express.json());
app.use(cors());

//FOR REGISTER
app.post("/register",async  (req, res) => {

    try {
        let user = req.body;
    
        const salt = await bcrypt.genSalt(10);
        
        user.password = await bcrypt.hash(user.password, salt);
    
        await userModel.create(user);
        res.status(201).send({ message: "User Registered" });
    
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Some Problem Occurred" });
      }
       
})
  
//FOR LOGIN

app.post("/login", async (req, res) => {
    try {
        let userCred = req.body;

        // Find user by email
        const user = await userModel.findOne({ email: userCred.email });

        if (!user) {
            return res.status(404).send({ message: "User not registered" }); //  Use `return` to stop execution
        }

        // Compare passwords asynchronously
        const isMatch = await bcrypt.compare(userCred.password, user.password);

        if (!isMatch) {
            return res.status(403).send({ message: "Incorrect Password" }); //  Use `return`
        }

        // Generate JWT Token
        jwt.sign({ email: user.email }, "diet", { expiresIn: "1h" }, (err, token) => {
            if (err) {
                return res.status(500).send({ message: "Error generating token" }); // ✅ Proper error handling
            }
            res.send({ message: "Login Success", token });
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" }); //  Proper server error handling
    }
});


//FOR FETCHING FOOD
app.get("/foods", verifyToken,async(req, res)=>{
   try{
    let foods = await foodModel.find();
    res.send(foods);
   }
   catch(err){
       console.log(err);
       res.status(500).send({message:"Could not fetch food items"});
   }
})



app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});
 