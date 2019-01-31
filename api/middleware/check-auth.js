const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        console.log(token)
        console.log(process.env.JWT_KEY)
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.userData = decoded
        next()
    } catch (err) {
        return res.status(401).json({
            message: 'Auth Failed. Please login.'
        })
    }    
}