const express = require("express")
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
//Routes start from here
const authRouter = require("./routes/Auth_user")
app.use(authRouter)

app.listen(3000, () => {console.log("Server is listening on port 3000")})