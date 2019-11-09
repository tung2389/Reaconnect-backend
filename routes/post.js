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

router.put('/:id', jwtAuthenticate, (req, res) => {
    const postId = req.params.id
    const { user } = req;
    const { content } = req.body;
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(400).json({
                message: "404 Not found"
            })
        }
        if(user._id.toString() !== post.authorId.toString()) {
            return res.status(400).json({
                message: "You don't have permission to edit this post"
            })         
        }
        post.content = content;
        post.save((err, newPost) => {
            res.send({
                message: "You have edited a post",
                post: newPost
            })
        })
    })
})

router.delete('/:id', jwtAuthenticate, (req, res) => {
    const postId = req.params.id
    const { user } = req;
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(400).json({
                message: "404 Not found"
            })
        }
        if(user._id.toString() !== post.authorId.toString()) {
            return res.status(400).json({
                message: "You don't have permission to delete this post"
            })    
        }
        postModel.deleteOne({_id: post._id}, (err) => {
            res.send({
                message: "You have deleted a post"
            })
        })
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
        let index = post.likes.indexOf(user._id.toString())
        if(index !== -1) {
            return res.status(400).json({
                message: "You have already liked this post"
            })
        }
        post.likes.push(user._id.toString());
        postModel.updateOne({ _id: post._id}, {
            likes: post.likes,
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
            $pull: {likes: user._id.toString()},
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
        let newComment = {
            authorId: user._id.toString(),
            author: user.username,
            content: content,
            createdAt: new Date(),
            _id: uuidv1()
        }
        post.comments.unshift(newComment)
        postModel.updateOne({_id: postId}, {
        	comments: post.comments,
        	commentCount: post.commentCount + 1
        }, (err) => {
        	res.send({
                message: "You have commented on a post",
                comment: newComment
            })
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

router.put('/:id/comments', jwtAuthenticate, (req, res) => {
    const postId = req.params.id;
    const commentId = req.query.id;
    const { user } = req;
    const { content } = req.body;
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(400).json({
                message: "Error, cannot edit comment"
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
                message: "You don't have permission to edit this comment"
            })
        }
        post.comments[index].content = content;
        postModel.updateOne({_id: post._id}, {
            comments: post.comments
        }, (err) => {
            res.send({message: "You have edited a comment"})
        })
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