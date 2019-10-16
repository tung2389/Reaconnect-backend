const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const router = express.Router();

router.post("/", (req, res, next) => {
    passport.authenticate("local", {session: false}, (err, user, info) => {
        if(err || !user) {
            return res.status(400).json({
                message: info
            })
        }
        //Not use session, so there is no need to use req.login()
        const jwtToken = jwt.sign({id: user.id}, process.env.JWT_SECRET)
        return res.status(200).json({jwtToken})
    })(req, res, next)
});

module.exports = router;