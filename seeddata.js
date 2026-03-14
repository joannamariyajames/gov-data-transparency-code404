const data = require("./db")

function seedData(){

console.log("Loading datasets...\n")

Object.keys(data).forEach(name => {

console.log(`Dataset loaded: ${name}`)
console.log(`Records: ${data[name].length}\n`)

})

console.log("All datasets ready.\n")

}

module.exports = seedData

