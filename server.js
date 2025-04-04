const express = require("express")
const app = express()
const bcrypt = require("bcrypt")

app.use(express.json())

const users = [] //turn this into a database

app.get("/users", (req,res) => {
    res.json(users) //this is returning from json, but you will turn it to return all users in tabular form from database
})

//sign up
app.post("/user_create", async (req,res) => { //we want to create a user, pass in username and pass in hashed password
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt) //this will collect from the user, when they want to sign up
        const user= {
            name: req.body.name,
            password: hashedPassword // this will then collect their info and the modified password
        }
        users.push(user) //add the modified user to database
        res.status(201).send("Success") //confirm access
    }
    catch{
        res.status(500).send()
    }
})

app.post("/verifyUser", async (req,res) => {
    const IncomingUser = users.find(user => user.name === req.body.name) //user.name is from the array, req.body.name is what the user is entering
    if(IncomingUser === undefined){
        return res.status(400).send("You do not have an account")
    }
    try{
        const isPasswordValid = await bcrypt.compare(req.body.password,IncomingUser.password)
        if(isPasswordValid){
            res.status(200).send("Sucessfully Verified User.")
        }
        else{
            res.status(400).send("Incorrect Password entered.")
        }
    }
    catch (error){
        console.error(error)
        res.status(500).send("Error captured")
    }
})

app.listen(3000, () => {console.log("Server is listening on port 3000")})