/**
 * DEPRECATED
 * statistic is not needed for new weibo database model
 */
var { Schema } = require("mongoose");
var db = require('../lib/mongo');

var statisticSchema = new Schema({
    name: String,
    values: [{
        name: String,
        value: Number
    }]
}, { collection: 'statistic' })

module.exports = db.model('Statistic', statisticSchema)