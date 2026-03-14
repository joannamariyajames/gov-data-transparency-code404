const express = require("express")
const cors = require("cors")
require("dotenv").config()


const datasetRoutes = require("./routes/Datasets")
const aiRoutes = require("./routes/aiQuery")

const connectDB = require("./mongo")

const app = express()

app.use(cors())
app.use(express.json())

async function startServer(){

await connectDB()

app.use("/routes", datasetRoutes)

/* AI route */

app.use("/ai", aiRoutes)

app.listen(5000,()=>{
console.log("Server running on port 5000")
})

}

startServer()