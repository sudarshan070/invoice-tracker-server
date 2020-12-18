var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt')

var adminSchema = new Schema({
    username: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true })

adminSchema.pre('save', async function (next) {
    try {
        if (this.password && this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10)
        }
        next()
    } catch (error) {
        next(error)
    }
})

adminSchema.method.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model("Admin", adminSchema)