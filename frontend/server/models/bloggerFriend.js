var { Schema } = require("mongoose");
var db = require('../lib/mongo');

var bloggerFriendSchema = new Schema({
    id: String,
    blogger_id: {
        type: Schema.Types.ObjectId,
        ref: 'Blogger'
    },
    name: String,
    friends: [{
        blogger_id: {
            type: Schema.Types.ObjectId,
            ref: 'Blogger'
        },
        friend_id: {
            type: Schema.Types.ObjectId,
            ref: 'BloggerFriend'
        },
        id: String,
        name: String,
    }]
}, { collection: 'blogger_friend' })

module.exports = db.model('BloggerFriend', bloggerFriendSchema)