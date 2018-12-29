const express = require('express')
const Blogger = require('../models/blogger')
const { rmEmptyProp } = require('../lib/utils')

const router = express.Router()


router.get('/:id?', (req, res) => {
    var findObj = rmEmptyProp(
        Object.assign(
            {},
            req.query,
            { _id: req.params.id, },
        )
    )
    console.info("Get bloggers", findObj)

    Blogger.find(findObj, (err, bloggers) => {
        if (err) {
            res.json(err)
            console.error("Get blogers fail", err)
        }

        res.json(bloggers)
    })
})


module.exports = router