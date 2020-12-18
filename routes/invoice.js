var express = require('express')
var router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const Invoice = require('../models/invoice')

// invoice create
router.post('/create', auth.verifyToken, async (req, res, next) => {
    try {
        console.log(req.body, 'body');
        console.log(req.user.userId, 'req.user.userId');
        req.body.userId = req.user.userId
        var invoice = await Invoice.create(req.body)
        var user = await User.findByIdAndUpdate(
            req.user.userId,
            { $addToSet: { invoice: invoice.id } },
            { new: true }
        )
        res.status(201).json({
            image: invoice.image,
            name: invoice.name,
            amount: invoice.amount
        })
    } catch (error) {
        next(error)
    }
})

// update invoice
router.put('/update/:id', auth.verifyToken, async (req, res, next) => {
    try {
        var updateInvoice = await Invoice.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
        res.json({ updateInvoice })
    } catch (error) {
        next(error)
    }
})

module.exports = router