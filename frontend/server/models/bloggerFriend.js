var { Schema } = require("mongoose");
var db = require('../lib/mongo');

var bloggerFriendSchema = new Schema({
    name: String,
    friends: [{
        name: String,
        sex: String,
        birthplace: String
    }]
}, { collection: 'blogger_friend' })

module.exports = db.model('BloggerFriend', bloggerFriendSchema)