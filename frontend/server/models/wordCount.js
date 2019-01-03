var { Schema } = require("mongoose");
var db = require('../lib/mongo');

var wordCountSchema = new Schema({
    name: String,
    wordCount: [{
        name: String,
        value: String,
    }]
}, { collection: 'word_count' })

module.exports = db.model('wordCount', wordCountSchema)