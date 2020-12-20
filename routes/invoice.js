var express = require('express')
var router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const Invoice = require('../models/invoice')




// invoice create
router.post('/create', auth.verifyToken, async (req, res, next) => {
    try {
        req.body.userId = req.user.userId
        var invoice = await Invoice.create(req.body)
        if (invoice) {
            var user = await User.findByIdAndUpdate(
                req.user.userId,
                { $addToSet: { invoiceId: invoice.id } },
                { new: true }
            )
            console.log(user, 'user is here');
            res.status(201).json({
                image: invoice.image,
                name: invoice.name,
                amount: invoice.amount,
                date: invoice.date
            })
        }
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


// delete invoice
router.delete('/delete/:id', auth.verifyToken, async (req, res, next) => {
    try {
        var invoice = await Invoice.findById(req.params.id)
        if (invoice.userId == req.user.userId) {
            invoice = await Invoice.findByIdAndDelete(invoice.id)
            console.log(user, 'user');
            res.json({
                success: 'invoice deleted successfully '
            })
        }
    } catch (error) {
        next(error)
    }
})


// get user invoice
router.get('/', auth.verifyToken, async (req, res, next) => {
    try {
        var user = await User.findById(req.user.userId)
        var invoice = await Invoice.find({})
        res.json({ invoice })
    } catch (error) {
        next(error)
    }
})

module.exports = router