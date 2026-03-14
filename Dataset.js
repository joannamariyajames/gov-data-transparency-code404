class Dataset{

constructor(name,data){

this.name=name
this.data=data

}

getPreview(){

return this.data.slice(0,10)

}

}

module.exports = Dataset
