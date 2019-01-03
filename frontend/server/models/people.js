var { Schema } = require("mongoose");
var db = require('../lib/mongo');

var peopleSchema = new Schema({
    name: String,
    sex: String,
    location: String
}, { collection: 'people' })

module.exports = db.model('People', peopleSchema)