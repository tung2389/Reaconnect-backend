const express = require('express')
const passport = require('passport')
const postModel = require('../model/post')

const router = express.Router();
router.post('/', (req, res, next) => {
    const { content } = req.body;
    passport.authenticate('jwt', {session: false}, (err, user) => {
        if(err) {
            return res.status(400).json({
                message: "Error occured"
            })
        }
        if(!user) {
            return res.status(400).json({
                message: "You must logged in first"
            })
        }
        else {
            const newPost = postModel({
                authorId: user._id,
                content: content,
                createdAt: new Date()
            })
            newPost.save((err) => {
                if(err) return console.log(err)
                res.send("Your post has been uploaded")
            })
        }
    })(req, res, next)
})

module.exports = router