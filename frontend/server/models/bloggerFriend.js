var { Schema } = require("mongoose");
var db = require('../lib/mongo');

var bloggerFriendSchema = new Schema({
    id: String,
    name: String,
    followers: Number,
    sex: String,
    birthplace: String,
    friends: [{
        friend_id: {
            type: Schema.Types.ObjectId,
            ref: 'BloggerFriend'
        },
        id: String,
        name: String,
        followers: Number,
        sex: String,
        birthplace: String,
    }]
}, { collection: 'blogger_friend' })

module.exports = db.model('BloggerFriend', bloggerFriendSchema)