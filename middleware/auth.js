var jwt = require('jsonwebtoken')

exports.generateJWT = async (user) => {
    try {
        var token = await jwt.sign({ userId: user.id }, 'thisIsSecrete')
        return token
    } catch (error) {
        return error
    }
}

exports.verifyToken = async (req, res, next) => {
    var token = req.headers.authorization || ""
    try {
        if (token) {
            var payload = await jwt.verify(token, 'thisIsSecrete')
            var user = {
                userId: payload.userId,
                token: token
            }
            req.user = user
            return next()
        } else {
            res.status(401).json({
                success: false,
                error: "Unauthorized"
            })
        }
    } catch (error) {
        next(error)
    }
}