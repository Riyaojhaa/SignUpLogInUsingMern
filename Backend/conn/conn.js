const mongoose = require("mongoose")

mongoose.connect(`mongodb://localhost:27017/${process.env.DATABASE}`)
.then(() => {
    console.log("connection successfully from database")
}).catch((err) => {
    console.log("err in connecting with db" + err)
})