const express = require('express')
const uuidv1 = require('uuid/v1');
const postModel = require('../../../model/post')

const router = express.Router({mergeParams: true})

router.post('/', (req, res) => {
    const postId = req.params.id;
    const { user, body: { content } } = req;
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(404).send("This post doesn't exist")
        }
        let newComment = {
            authorId: user._id.toString(),
            author: user.username,
            authorImageUrl: user.imageUrl,
            content: content,
            createdAt: new Date(),
            _id: uuidv1()
        }
        post.comments.unshift(newComment)
        postModel.updateOne({_id: postId}, {
        	comments: post.comments,
        	commentCount: post.commentCount + 1
        }, (err) => {
        	res.send(newComment)
        })
    })
})

router.get('/', (req, res) => {
    const postId = req.params.id;
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(404).send("This post doesn't exist")
        }
        res.send(post.comments)
    })
})

router.put('/:commentId', (req, res) => {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const { user } = req;
    const { content } = req.body;
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(404).send("This post doesn't exist")
        }
        let index = post.comments.map((item) => item._id).indexOf(commentId);
        if(index === -1) {
            return res.status(404).send("This comment doesn't exist")    
        }
        if(user._id.toString() !== post.comments[index].authorId.toString()) {
            return res.status(403).send("You don't have permission to edit this comment")
        }
        post.comments[index].content = content;
        postModel.updateOne({_id: post._id}, {
            comments: post.comments
        }, (err) => {
            res.send(post.comments[index])
        })
    })
})

router.delete('/:commentId', (req, res) => {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const { user } = req;
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(404).send("This post doesn't exist")
        }
        let index = post.comments.map((item) => item._id).indexOf(commentId);
        if(index === -1) {
            return res.status(404).send("This comment doesn't exist")  
        }
        if(user._id.toString() !== post.comments[index].authorId.toString()) {
            return res.status(403).send("You don't have permission to delete this comment")
        }
        postModel.updateOne({_id: post._id}, {
            $pull: {comments: {_id: commentId}},
            commentCount: post.commentCount - 1
        }, (err) => {
            res.send( "You have deleted a comment")
        })
    })
})

module.exports = router