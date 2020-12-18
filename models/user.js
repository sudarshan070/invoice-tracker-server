var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt')

var userSchema = new Schema({
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
    invoiceId: [{
        type: Schema.Types.ObjectId,
        ref: "Invoice"
    }]
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    try {
        if (this.password && this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10)
        }
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.method.verifyPassword = function (password) {
    console.log(password);
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model("User", userSchema)