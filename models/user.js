var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt')

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

useSchema.pre('save', function (next) {
    if (this.password && this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, 10)
        next()
    }
})

useSchema.method.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model("User", useSchema)