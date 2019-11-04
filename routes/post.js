const express = require('express')
const postModel = require('../model/post')
const userModel = require('../model//user')
const jwtAuthenticate = require('../middleware/jwtAuthenticate')
const uuidv1 = require('uuid/v1');

const router = express.Router()
router.get('/:id', jwtAuthenticate, (req, res) => {
    const postId = req.params.id
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(400).json({
                message: "404 Not found"
            })
        }
        res.send(post)
    })
})

router.post('/:id/likes', jwtAuthenticate, (req, res) => {
    const postId = req.params.id;
    const { user } = req;
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(400).json({
                message: "Error, cannot like"
            })
        }
        let index = post.likes.indexOf(user._id)
        if(index !== -1) {
            return res.status(400).json({
                message: "You have already liked this post"
            })
        }
        postModel.updateOne({ _id: post._id}, {
            // likes: post.likes.push(user._id),
            $push: { likes: user._id },
            likeCount: post.likeCount + 1
        }, (err) => {
            res.send({message: "You have liked a post"})
        })
    })
})

router.get('/:id/likes', jwtAuthenticate, (req, res) => {
    const postId = req.params.id;
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(400).json({
                message: "404 Not found"
            })
        }
        res.send(post.likes)
    })
})

router.delete('/:id/likes', jwtAuthenticate, (req, res) => {
    const postId = req.params.id;
    const { user } = req;
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(400).json({
                message: "Error, cannot unlike"
            })
        }
        postModel.updateOne({_id: post._id}, {
            $pull: {likes: user._id},
            likeCount: post.likeCount - 1
        }, (err) => {
            res.send({message: "You have unliked a post"})
        })
    })
})

router.post('/:id/comments', jwtAuthenticate, (req, res) => {
    const postId = req.params.id;
    const { user, body: { content } } = req;
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(400).json({
                message: "Error, cannot comment"
            })
        }
        postModel.updateOne({ _id: post._id}, {
            // likes: post.likes.push(user._id),
            $push: { comments: {
                authorId: user._id,
                content: content,
                _id: uuidv1()
            } },
            commentCount: post.commentCount + 1
        }, (err) => {
            res.send({message: "You have commented on a post"})
        })
    })
})

router.get('/:id/comments', jwtAuthenticate, (req, res) => {
    const postId = req.params.id;
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(400).json({
                message: "404 Not found"
            })
        }
        res.send(post.comments)
    })
})

router.delete('/:id/comments', jwtAuthenticate, (req, res) => {
    const postId = req.params.id;
    const commentId = req.query.id;
    const { user } = req;
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(400).json({
                message: "Error, cannot delete comment"
            })
        }
        let index = post.comments.map((item) => item._id).indexOf(commentId);
        if(index === -1) {
            return res.status(400).json({
                message: "404 not found"
            })  
        }
        if(user._id.toString() !== post.comments[index].authorId.toString()) {
            return res.status(400).json({
                message: "You don't have permission to delete this comment"
            })
        }
        postModel.updateOne({_id: post._id}, {
            $pull: {comments: {_id: commentId}},
            commentCount: post.commentCount - 1
        }, (err) => {
            res.send({message: "You have deleted a comment"})
        })
    })
})
module.exports = router