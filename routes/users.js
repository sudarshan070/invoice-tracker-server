var express = require('express');
var router = express.Router();
const User = require('../models/user')
const auth = require('../middleware/auth')


router.post('/', async (req, res, next) => {
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
    next(error)
  }
})

module.exports = router;
