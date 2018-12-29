var { Schema } = require("mongoose");
var db = require('../lib/mongo');

var bloggerSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    id: String,
    sex: String,
    birthplace: String,
    weibo_num: Number,
    following: Number,
    followers: Number,
})

module.exports = db.model('blogger', bloggerSchema)