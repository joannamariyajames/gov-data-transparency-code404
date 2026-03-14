const express = require("express")
const router = express.Router()

const { runAgent } = require("../ai/agent")

router.post("/ask-ai", async (req,res)=>{

try{

const { query } = req.body

if(!query){
return res.status(400).json({
error:"Query required"
})
}

const result = await runAgent(query)

res.json(result)

}
catch(err){

console.error(err)

res.status(500).json({
error:"AI processing error"
})

}

})

module.exports = router