var mongoose = require('mongoose')
var Schema = mongoose.Schema

var useSchema = new Schema({
    username: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true })

module.exports = mongoose.model("User", useSchema)