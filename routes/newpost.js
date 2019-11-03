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
        const newPost = postModel({
            authorId: user._id,
            author: user.username,
            content: content,
            createdAt: new Date()
        })
        newPost.save((err) => {
            if(err) return console.log(err)
            res.json({
                message: "Your post has been uploaded",
                post: newPost
            })
        })
    })(req, res, next)
})

module.exports = router