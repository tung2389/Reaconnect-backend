const express = require('express')
const postModel = require('../model/post')
const userModel = require('../model/user')
const jwtAuthenticate = require('../middleware/jwtAuthenticate')
const uuidv1 = require('uuid/v1');

const router = express.Router()

router.get('/', jwtAuthenticate, (req, res) => {
    const { lastDate, limit } = req.query;
	const { user } = req;
    postModel
        .find({createdAt: {$lt: lastDate}})
        .sort({createdAt: -1})
        .limit(Number(limit))
        .then(data => {
            let shortData = data.map((post) => {
				post = post.toObject()
				let index = post.likes.indexOf(user._id.toString())
				if(index !== -1)
					post.likedByUser = true;
				else 
					post.likedByUser = false;
				delete post.likes
				delete post.comments
				return post
			})
            res.send(shortData)
        })
        .catch(err => {
            res.status(400).json({
                message: "Error occured"
            })
        })
})

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
        let index = post.likes.indexOf(user._id.toString())
        if(index === -1) {
            return res.status(400).json({
                message: "You haven't liked this post"
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

router.put('/:postId/comments/:commentId', jwtAuthenticate, (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
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

router.delete('/:postId/comments/:commentId', jwtAuthenticate, (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
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