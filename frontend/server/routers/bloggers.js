const express = require('express')
const Blogger = require('../models/blogger')
const BloggerFriend = require('../models/bloggerFriend')
const WeiboContent = require('../models/weiboContent')
const WordCount = require('../models/wordCount')
const { rmEmptyProp } = require('../lib/utils')

const router = express.Router()


router.get('/:name?', (req, res) => {
    var findObj = rmEmptyProp(
        Object.assign(
            {},
            req.query,
            { name: req.params.name, },
        )
    )
    console.info("Get bloggers", findObj)

    Blogger.find(findObj, (err, bloggers) => {
        if (err) {
            return res.status(500).send(err)
        }
        if (bloggers.length === 0) {
            return res.status(404).send(`Blogger Not Existed`)
        }

        res.json(bloggers)
    })
})

router.get('/:name/friends', (req, res) => {
    var findObj = {
        name: req.params.name,
    }
    console.info("Get blogger Friends", findObj)

    BloggerFriend.findOne(findObj, (err, bloggerFrined) => {
        if (err) {
            return res.status(500).send(err)
        }
        if (!bloggerFrined) {
            return res.status(404).send(`${req.params.name} Not Existed`)
        }

        res.json(bloggerFrined.friends)
    })
})

router.get('/:name/weiboContent', (req, res) => {
    var findObj = {
        name: req.params.name,
    }
    console.info("Get blogger weibo content", findObj)

    WeiboContent.findOne(findObj, (err, weiboContent) => {
        if (err) {
            return res.status(500).send(err)
        }
        if (!weiboContent) {
            return res.status(404).send(`${req.params.name} Not Existed`)
        }

        res.json(weiboContent.weibo_content)
    })
})

router.get('/:name/wordCount', (req, res) => {
    var findObj = {
        name: req.params.name,
    }
    console.info("Get blogger word Count", findObj)

    WordCount.findOne(findObj, (err, wordCount) => {
        if (err) {
            return res.status(500).send(err)
        }
        if (!wordCount) {
            return res.status(404).send(`${req.params.name} Not Existed`)
        }

        res.json(wordCount.wordCount)
    })
})


module.exports = router