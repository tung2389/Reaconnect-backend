const express = require('express')
const postModel = require('../model/post')
const jwtAuthenticate = require('../middleware/jwtAuthenticate')

const router = express.Router();
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

module.exports = router