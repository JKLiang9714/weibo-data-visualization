const express = require('express')
const Statistic = require('../models/statistic')
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
    console.info("Get Statistics", findObj)

    Statistic.find(findObj, (err, bloggers) => {
        if (err) {
            return res.status(500).send(err)
        }
        if (bloggers.length === 0) {
            return res.status(404).send(`Statistics Not Existed`)
        }

        res.json(bloggers)
    })
})

module.exports = router