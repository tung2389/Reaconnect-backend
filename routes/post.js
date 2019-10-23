const express = require('express')
const passport = require('passport')
const postModel = require('../model/post')
const userModel = require('../model//user')

const router = express.Router()
router.get('/:id', (req, res, next) => {
    const postId = req.params.id
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
            postModel.findById(postId, (err, post) => {
                if(err || !post) {
                    return res.status(400).json({
                        message: "404 Not found"
                    })
                }
                userModel.findById(post.authorId, (err, user) => {
                    if(err || !user) {
                        user.username = "Undefined"
                    }
                })
                res.json({
                    content: post.content,
                    author: user.username,
                    createdAt: post.createdAt,
                })
            })
        }
    })(req, res, next)
})

module.exports = router