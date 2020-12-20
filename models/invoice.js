const mongoose = require("mongoose")
const Schema = mongoose.Schema

const invoicesSchema = new Schema({
    image: String,
    name: String,
    amount: String,
    date: Date,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true })

module.exports = mongoose.model("Invoice", invoicesSchema)