const express = require('express')
const userModel = require('../model/user')

const router = express.Router()
router.get('/:id', (req, res) => {
    let userId = req.params.id
    userModel.findById(userId, (err, user) => {
        if(!user || user.verified) {
            res.status(400).json({
                message: "Sorry, your request doesn't exist or the link has expired"
            })
        }
        else {
            userModel.updateOne({_id: user._id}, {verified: true}, (err) => {
                if(err) {
                    return res.status(400).json({
                        message: "Errors occur. Please try again later"
                    })
                }
                res.status(200).json({
                    message: "Your account has been verified. Now you can login"
                })
            })
        }
    })
})

module.exports = router;