const express = require('express')
const User = require('../model/user')

const router = express.Router()
router.get('/:id', (req, res) => {
    let userId = req.params.id
    User.findById(userId, (err, user) => {
        if(user.verified || !user) {
            res.status(400).send("Sorry, your request doesn't exit")
        }
        else {
            user.verified = true;
            user.save((err) => {
                if(err) console.log(err)
            })
            res.status(200).send("Your account has been verified. Now you can login")
        }
    })
})

module.exports = router;