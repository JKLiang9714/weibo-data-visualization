const express = require('express')
const Blogger = require('../models/blogger')
const co = require('co');

const router = express.Router()

// 北京 东城区 -> 北京
const place = (birthplace) => {
    return birthplace.split(" ")[0]
}

router.get('/location', (req, res) => {

    console.info("Get Location Statistics")

    Blogger.aggregate([
        { $group: { _id: "$birthplace", value: { $sum: 1 } } }
    ]).then(distribution => {
        let dic = {}
        distribution.forEach(element => {
            const currPlace = place(element._id)
            if (!dic[currPlace]) {
                dic[currPlace] = 0
            }
            dic[currPlace] += element.value
        });
        const resJson = []
        for (let key in dic) {
            resJson.push({
                name: key,
                value: dic[key]
            })
        }
        res.json(resJson)
    })

})

router.get('/sex', (req, res) => {

    console.info("Get sex Statistics")

    Blogger.aggregate([
        { $group: { _id: "$sex", value: { $sum: 1 } } }
    ]).then(distribution => {
        res.json(
            distribution.map(i => ({
                name: i._id,
                value: i.value
            }))
        )
    })

})

module.exports = router