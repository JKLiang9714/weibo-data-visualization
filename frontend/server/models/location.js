var { Schema } = require("mongoose");
var db = require('../lib/mongo');

var locationSchema = new Schema({
    name: String,
    count: Number,
}, { collection: 'location_heat_map' })

module.exports = db.model('Location', locationSchema)