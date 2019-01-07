var mongoose = require("mongoose");

const IP = "10.82.82.15"
const PORT = "27017"
const DATABASE = "NewWeibo"


mongoose.connect(
    `mongodb://${IP}:${PORT}/${DATABASE}`
);

const db = mongoose.connection

db.on('error', (error) => {
    console.error('mongodb connect error', error)
})
db.once('open', () => {
    console.info("mongodb connect success")
})

module.exports = mongoose.connection