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
    isAdmin: {
        type: Boolean,
        default: false
    },
    invoiceId: [{
        type: Schema.Types.ObjectId,
        ref: "Invoice"
    }]
}, { timestamps: true })


userSchema.pre("save", async function (next) {
    try {
        if (this.password && this.isModified('password')) {
            this.password = await bcrypt.hashSync(this.password, 10)
        }
        return next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("User", userSchema)