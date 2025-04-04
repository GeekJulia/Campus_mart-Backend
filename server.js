const express = require('express')
const app = express()
const bcrypt = require("bcrypt")

app.use(express.json())

const users = [] // this list of users will be in a database, this is for testing purposes
app.get("/users", (req , res) => {
    res.json(users)
})

app.post("/users", async (req,res) => { //create a user,hashing the password and saving it in users list or database
    try{
        const salt = await bcrypt.genSalt() //we put await in front cause it is asynchronus
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        console.log(salt)
        console.log(hashedPassword)
        const user = {
            name: req.body.name,
            password: hashedPassword
        }
        users.push(user)
        res.status(201).send()
    }
    catch{
        res.status(500).send()
    }
})
//testing
app.post("/users/login", async (req,res) => {
    const user = users.find(user => user.name === req.body.name)
    if(user == null){
        return res.status(400).send("Cannot find user")
    }
    try{
        if(await bcrypt.compare(req.body.password,user.password)){
            res.send("Success")
        }
        else{
            res.send("Incorrect Password.Please try again")
        }
    }
    catch{
        res.status(500).send()
    }
})

app.delete("/users/:name", (req,res) => {
    const user = users.find(user => user.name === req.params.name);

    if(user === -1){
        return res.status(404).send("User not Found")
    }

    users.splice(user,1)
    res.send("User deleted sucessfully")
})


app.listen(3000, () => {console.log("Server is listening on port 3000")})