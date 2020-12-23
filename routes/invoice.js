var express = require('express')
var router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const Invoice = require('../models/invoice')



// all invoices 
router.get('/list', auth.verifyToken, async (req, res, next) => {
    try {
        var invoices = await Invoice.find({}).populate("userId")
        res.status(201).json({ invoices })
    } catch (error) {
        next(error)
    }
})

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


// single invoice

router.get('/:id', async (req, res, next) => {
    try {
        var getInvoice = await Invoice.findById(req.params.id)
        res.status(201).json({ getInvoice })
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
        console.log(invoice);
        if (invoice.userId == req.user.userId) {
            invoice = await Invoice.findByIdAndDelete(invoice.id)
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
        var invoices = await Invoice.find({})
        console.log(invoices, 'all invoices');
        var fil = invoices.filter(e => e.userId)
        if (user.isAdmin) {
            res.json(invoices)
        } else {
            let userInvoices = invoices.filter(e => (e.userId == user.id))
            res.json({ userInvoices })
        }
    } catch (error) {
        next(error)
    }
})


module.exports = router