const BloggerFriend = require('../models/bloggerFriend')
const co = require('co');

co(function* () {
    const cursor = BloggerFriend.find({}).cursor()
    for (let doc = yield cursor.next(); doc != null; doc = yield cursor.next()) {
        console.info(`分析${doc.name}的朋友关系拓扑`, doc.friends.length)

        // generate graph
        const graph = { nodes: [], links: [] }
        graph.nodes.push({ name: doc.name })

        const friendDic = {}
        doc.friends.forEach(friend => {
            graph.nodes.push({ name: friend.name })
            graph.links.push({ source: doc.name, target: friend.name })
            friendDic[friend.name] = true
        })

        for (let i = 0; i < doc.friends.length; i++) {
            const friend = doc.friends[i]

            const friendDoc = yield BloggerFriend.findOne({ name: friend.name }).exec()
            if (friendDoc) {
                friendDoc.friends.forEach(friend_friend => {
                    if (friendDic[friend_friend]) {
                        console.log(
                            `add additional link 
                            from ${friend.name} to ${friend_friend.name}`)
                        graph.links.push({
                            source: friend.name,
                            target: friend_friend.name
                        })
                    }
                })
            }
        }
        console.log(`成功分析${doc.name}的朋友关系拓扑`)
        // save graph
        yield BloggerFriend.updateOne(
            { name: doc.name },
            { graph },
        )
        console.info(`成功保存${doc.name}的朋友关系拓扑`)
    }

    console.log("DONE!")
});