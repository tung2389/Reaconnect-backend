const express = require('express')
const postModel = require('../model/post')
const jwtAuthenticate = require('../middleware/jwtAuthenticate')

const router = express.Router();
router.post('/', jwtAuthenticate, (req, res) => {
    const { body: { content }, user } = req;
    const newPost = postModel({
        authorId: user._id.toString(),
        author: user.username,
        content: content,
        createdAt: new Date(),
        likes: [],
        likeCount: 0,
        comments: [],
        commentCount: 0
    })
    newPost.save((err) => {
        if(err) return console.log(err)
        res.json({
            message: "Your post has been uploaded",
            post: newPost
        })
    })
})

module.exports = router