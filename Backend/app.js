require('dotenv').config();
const express = require("express")
const conn = require("./conn/conn")
const Register = require("./db/schema")
const port = process.env.PORT || 5000
const app = express()
const userrouter = require('./Routes/auth')
const cookieParser = require('cookie-parser');
app.use(cookieParser());




app.use(express.json());
app.use(userrouter);



app.listen(port , () => {
    console.log(`server is running in ${port}`)
})