const express = require("express")
const router = express.Router()

const connectDB = require("../mongo")

/* GET DATASET */

router.get("/datasets/:name", async (req,res)=>{

try{

const db = await connectDB()

const rawData = await db.collection("gov_records").find({}).toArray()

const formatted = rawData.map(d => ({

State: d.State,
Country: d.Country,
Year: d.Year,
...d

}))

res.json(formatted)

}

catch(err){

console.error(err)
res.status(500).json({error:"Server error"})

}

})


/* QUERY ROUTE */

router.post("/query", async (req,res)=>{

try{

const db = await connectDB()

const rawData = await db.collection("gov_records").find({}).toArray()

res.json({

dataset:"gov_records",
data:rawData,
insight:"MongoDB data retrieved"

})

}

catch(err){

console.error(err)
res.status(500).json({error:"Server error"})

}

})


module.exports = router