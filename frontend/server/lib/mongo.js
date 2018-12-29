var { connect } = require("mongoose");

const IP = "localhost"
const PORT = "27017"
const COLLECTIONS = "myblog"

var db = connect(`mongodb://${IP}:${PORT}/${COLLECTIONS}`);
module.exports = db