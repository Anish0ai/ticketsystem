const express = require("express")
const cors = require("cors")
const router = require("./router/router")

const app = express()

app.use(express.json())
app.use(cors)
app.use("/api/v1", router)


app.listen(3000,()=>{
    console.log("Server is listenning to port 3000 ke");    
})