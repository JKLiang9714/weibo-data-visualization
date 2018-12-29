var { Schema } = require("mongoose");
var db = require('../lib/mongo');

var bloggerSchema = new Schema({
    name: String,
    id: String,
    sex: String,
    birthplace: String,
    weibo_num: Number,
    following: Number,
    followers: Number,
}, { collection: 'blogger_info' })

module.exports = db.model('Blogger', bloggerSchema)