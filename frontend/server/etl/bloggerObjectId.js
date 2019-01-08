const BloggerFriend = require('../models/bloggerFriend')
const Blogger = require('../models/blogger')
const co = require('co');

// 不用从头开始计算
const START = 0

co(function* () {
    const cursor = BloggerFriend.find({}).cursor()

    let sumPeople = 0

    for (let doc = yield cursor.next(); doc != null; doc = yield cursor.next()) {
        if (sumPeople < START) {
            sumPeople++
            continue
        }
        let blogger, bloggerFriend
        blogger = yield Blogger.findOne({ id: doc.id }).exec()
        if (blogger === null) {
            console.log(`${doc.id} not exist`)
            yield BloggerFriend.deleteOne({ _id: doc._id })
            continue
        }
        doc.blogger_id = blogger._id
        doc.name = blogger.name
        doc.followers = blogger.followers
        doc.sex = blogger.sex
        doc.birthplace = blogger.birthplace


        const newFriends = []
        for (let i = 0; i < doc.friends.length; i++) {
            const friend = doc.friends[i]
            blogger = yield Blogger.findOne({ id: friend.id }).exec()
            bloggerFriend = yield BloggerFriend.findOne({ id: friend.id }).exec()
            if (blogger && bloggerFriend) {
                newFriends.push({
                    blogger_id: blogger._id,
                    friend_id: bloggerFriend._id,
                    id: blogger.id,
                    name: blogger.name,
                    followers: blogger.followers,
                    sex: blogger.sex,
                    birthplace: blogger.birthplace
                })
            }
        }
        doc.friends = newFriends
        yield BloggerFriend.updateOne(
            { _id: doc._id },
            doc
        )

        sumPeople++
        console.info(`${sumPeople} ${doc.name} 更新ObjectId成功`)
    }
    console.log("DONE!")
})
