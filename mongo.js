const { MongoClient } = require("mongodb")

const uri = "mongodb://localhost:27017"

const client = new MongoClient(uri)

let db

async function connectDB(){

    if(!db){

        await client.connect()

        db = client.db("admin")

        console.log("MongoDB connected")

    }

    return db
}

module.exports = connectDB

