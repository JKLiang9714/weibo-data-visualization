var { Schema } = require("mongoose");
var db = require('../lib/mongo');

var weiboContentSchema = new Schema({
    name: String,
    weibo_content: [{
        publish_content: String,
        publish_location: String,
        publish_time: String,
        like: Number,
        forward: Number,
        comment: Number,
        publish_tool: String
    }]
}, { collection: 'weibo_content' })

module.exports = db.model('WeiboContent', weiboContentSchema)