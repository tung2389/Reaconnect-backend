const express = require('express')
const bcrypt = require('bcryptjs')
const sendMail = require('../controller/sendMail')
const userModel = require('../model/user')
const { validateSignup } = require('../controller/validateAccount')

const router = express.Router()

router.post('/', (req, res) => {
    const { email, password, confirmPassword, username } = req.body
    const validation = validateSignup(email, password, confirmPassword, username);
    if(validation !== true) {
        return res.status(400).send(validation)
    }
    userModel.findOne({email: email}, (err, user) => {
        if(user && user.verified) {
            return res.status(400).json({
				email: "That email has already been registered"
			})
        }
        else {
            if(user) {
                user.remove()
            }
            const newUser = new userModel({
                email: email,
                password: password,
                username: username,
                verified: false,
                createdAt: new Date()
            })
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hashPassword) => {
                    newUser.password = hashPassword
                    newUser.save(err => {
                        if(err) return console.log(err);
                        sendMail(email, newUser._id)
                        res.json({
							message: "Please check your email to verify your account"
						})
                    })
                })
            })
        }
    })
})

module.exports = router