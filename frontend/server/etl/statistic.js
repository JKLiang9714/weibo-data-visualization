/**
 * DEPRECATED
 * caculate directly instead
 */

const People = require('../models/people')
const Statistic = require('../models/statistic')
const co = require('co');


co(function* () {

    const locationDistribution = yield People.aggregate([
        { $group: { _id: "$location", value: { $sum: 1 } } }
    ])
    console.log(locationDistribution)

    yield new Statistic({
        name: "locationDistribution",
        values: locationDistribution.map(i => ({
            name: i._id,
            value: i.value
        }))
    }).save()


    const sexDistribution = yield People.aggregate([
        { $group: { _id: "$sex", value: { $sum: 1 } } }
    ])
    console.log(sexDistribution)

    yield new Statistic({
        name: "sexDistribution",
        values: sexDistribution.map(i => ({
            name: i._id,
            value: i.value
        }))
    }).save()

    console.info("done!")
})