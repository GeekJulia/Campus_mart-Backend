const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")

const users = [] //turn this into a database

router.get("/users", (req,res) => {
    res.json(users) //this is returning from json, but you will turn it to return all users in tabular form from database
})

//sign up
router.post("/user/create", async (req,res) => { //we want to create a user, pass in username and pass in hashed password
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

//sign_in
router.post("/user/verify", async (req,res) => {
    const userAccount = users.find(user => user.name === req.body.name) //find a name of the user in the array, that is same as what is in the request body
    if(userAccount === undefined){
        return res.status(400).send("You do not have an account")
    }
    try{
        const isPasswordValid = await bcrypt.compare(req.body.password,userAccount.password)
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

module.exports = router