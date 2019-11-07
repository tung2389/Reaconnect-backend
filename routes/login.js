const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const { validateLogin } = require('../controller/validateAccount')

const router = express.Router();

router.post("/", (req, res, next) => {
    let validation = validateLogin(req.body.email, req.body.password)
    if(validation !== true) {
        return res.status(400).send(validation)
    }
    passport.authenticate("local", {session: false}, (err, user, info) => {
        if(err || !user) {
            return res.status(400).send(info)
        }
        //Not use session, so there is no need to use req.login()
        const jwtToken = jwt.sign({id: user._id}, process.env.JWT_SECRET)
		user = user.toObject()
		delete user.password
        return res.status(200).json({
            jwtToken: jwtToken,
            user: user
        })
    })(req, res, next)
});

module.exports = router;