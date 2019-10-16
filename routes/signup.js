const express = require('express')
const bcrypt = require('bcryptjs')
const sendMail = require('../controller/sendMail')
const userModel = require('../model/user')

const router = express.Router()

router.post('/', (req, res) => {
    const { email, password } = req.body
    userModel.findOne({email: email}, (err, user) => {
        if(user && user.verified) {
            res.status(400).send("That email has already been registered")
        }
        else {
            if(user) {
                user.remove()
            }
            const newUser = new userModel({
                email: email,
                password: password,
                verified: false,
                createdAt: new Date()
            })
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hashPassword) => {
                    newUser.password = hashPassword
                    newUser.save(err => {
                        if(err) return console.log(err);
                        sendMail(email, newUser._id)
                        res.send("Please check your email to verify your account")
                    })
                })
            })
        }
    })
})

module.exports = router