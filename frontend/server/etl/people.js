const BloggerFriend = require('../models/bloggerFriend');
const Blogger = require('../models/blogger')
const People = require('../models/people')
const co = require('co');

// 北京 东城区 -> 北京
const place = (birthplace) => {
    return birthplace.split(" ")[0]
}

co(function* () {
    // 1. 遍历blogger_info
    let cursor = Blogger.find({}).cursor()

    for (let doc = yield cursor.next(); doc != null; doc = yield cursor.next()) {
        const exist = yield People.findOne({ name: doc.name }).exec()
        if (!exist) {
            yield new People({
                name: doc.name,
                sex: doc.sex,
                location: place(doc.birthplace)
            }).save()
        } else {
            console.info(`已存在${doc.name}`)
        }
    }

    console.log("DONE Bloggers!")

    // 2. 遍历blogger_friend
    cursor = BloggerFriend.find({}).cursor()
    let sumPeople = 0

    for (let doc = yield cursor.next(); doc != null; doc = yield cursor.next()) {
        let count = 0
        let countExist = 0

        for (let i = 0; i < doc.friends.length; i++) {
            const friend = doc.friends[i]
            const exist = yield People.findOne({ name: friend.name }).exec()
            if (!exist) {
                yield new People({
                    name: friend.name,
                    sex: friend.sex,
                    location: place(friend.birthplace)
                }).save()
                count++
            } else {
                countExist++
            }
        }

        sumPeople++
        console.info(`NO.${sumPeople} ${doc.name} 的朋友中 添加${count} 已存在${countExist}`)
    }

    console.log("DONE Friend!")
})