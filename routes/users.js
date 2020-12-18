var express = require('express');
var router = express.Router();
const User = require('../models/user')
const auth = require('../middleware/auth')


// register user
router.post('/register', async (req, res, next) => {
  try {
    var user = await User.create(req.body)
    var token = await auth.generateJWT(user)
    res.status(201).json({
      email: user.email,
      username: user.username,
      password: user.password,
      token
    })
  } catch (error) {
    res.json({
      status: false,
      message: error.message.toString().includes('duplicate') ? `email is already exist.` : error.message.split(':')[0]
    })
  }
})


// login user
router.post('/login', async (req, res, next) => {
  var { password, email } = req.body
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and Password required"
    })
  }

  try {
    var user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Email is wrong"
      })
    }

    // if (!await user.verifyPassword(password)) {
    //   console.log(user.password, 'user.password');
    //   console.log(password, 'password in verifyPassword');
    //   return res.status(400).json({
    //     success: false,
    //     error: "Password is wrong"
    //   })
    // }
    var token = await auth.generateJWT(user)
    res.status(201).json({
      email: user.email,
      username: user.username,
      token
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router;
