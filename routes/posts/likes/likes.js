const express = require('express')
const postModel = require('../../../model/post')

const router = express.Router({mergeParams: true})

router.post('/', (req, res) => {
    const postId = req.params.id;
    const { user } = req;
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(404).send("This post doesn't exist")
        }
        let index = post.likes.indexOf(user._id.toString())
        if(index !== -1) {
            return res.status(400).send("You have already liked this post")
        }
        post.likes.push(user._id.toString());
        postModel.updateOne({ _id: post._id}, {
            likes: post.likes,
            likeCount: post.likeCount + 1
        }, (err) => {
            res.send( "You have liked a post")
        })
    })
})

router.get('/', (req, res) => {
    const postId = req.params.id;
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(404).send("404 Not found")
        }
        res.send(post.likes)
    })
})

router.delete('/', (req, res) => {
    const postId = req.params.id;
    const { user } = req;
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(404).send("This post doesn't exist")
        }
        let index = post.likes.indexOf(user._id.toString())
        if(index === -1) {
            return res.status(400).send("You haven't liked this post")
        }
        postModel.updateOne({_id: post._id}, {
            $pull: {likes: user._id.toString()},
            likeCount: post.likeCount - 1
        }, (err) => {
            res.send( "You have unliked a post")
        })
    })
})

module.exports = router