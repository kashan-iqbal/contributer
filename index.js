const jsonFile = require("jsonfile")
const moment = require('moment')
const simplegit = require("simple-git")


const filePath = "./data.json"


const DATE = moment().subtract(1,'d').format()

const date ={
    date:DATE
}

jsonFile.writeFile(filePath,date)

console.log(date)

simplegit().add([filePath]).commit(DATE,{'--date':DATE}).push()





