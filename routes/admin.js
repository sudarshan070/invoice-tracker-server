var express = require('express')
var router = express.Router()
var Admin = require('../models/admin')
var auth = require('../middleware/auth')
var Invoice = require('../models/invoice')

// get all invoice
router.get('/', auth.verifyToken, async (req, res, next) => {
    try {
        var invoice = await Invoice.find({})
        res.status(201).json({ invoice })
    } catch (error) {
        next(error)
    }
})

// create admin
router.post('/register', async (req, res, next) => {
    try {
        var admin = await Admin.create(req.body)
        var token = await auth.generateJWT(admin)
        res.status(201).json({
            email: admin.email,
            username: admin.username,
            password: admin.password,
            token
        })
    } catch (error) {
        res.json({
            status: false,
            message: error.message.toString().includes('duplicate') ? `email is already exist.` : error.message.split(':')[0]
        })
    }
})

// admin login

router.post('/login', async (req, res, next) => {
    var { password, email } = req.body
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: "Email and Password required"
        })
    }

    try {
        var admin = await Admin.findOne({ email })
        if (!admin) {
            return res.status(400).json({
                success: false,
                error: "Email is wrong"
            })
        }
        var token = await auth.generateJWT(admin)
        res.status(201).json({
            email: admin.email,
            username: admin.username,
            token
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router