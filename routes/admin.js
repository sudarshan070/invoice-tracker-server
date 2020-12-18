var express = require('express')
var router = express.Router()
var Admin = require('../models/admin')
var auth = require('../middleware/auth')

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


module.exports = router