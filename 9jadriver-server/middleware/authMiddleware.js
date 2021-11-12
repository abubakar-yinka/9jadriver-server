const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

exports.protect = async (req, res, next) => {
    let token

    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1].toString()
            const verified = jwt.verify(token, process.env.JWT_SECRET)

            
            req.user = await User.findById(verified.id).select('-password')
            console.log(verified.id)
            console.log(req.user);
            next()
        } catch (error) {
            console.error(error)
            // res.status(401)
            // throw new Error('Not authorized')
        }
    }

    if (!token) {
        res.status(401).json({ message: `Not Unauthorized, No token found` })

    }

    next()
} 