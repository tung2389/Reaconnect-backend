const express = require('express')

const { bucket } = require('../../config/admin')
const config = require('../../config/firebaseConfig')
const handleUploadImage = require('../../controller/handleUploadImage')

const likes = require('./likes/likes')
const comments = require('./comments/comments')
const postModel = require('../../model/post')
const jwtAuthenticate = require('../../middleware/jwtAuthenticate')
const { text } = require('express')

const router = express.Router()
router.use(jwtAuthenticate)

// Likes and comments route
router.use('/:id/likes', likes)
router.use('/:id/comments', comments)

// Get a limited number of current posts
router.get('/', (req, res) => {
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
            res.status(500).send("Error occured")
        })
})

// Upload post
router.post('/', (req, res) => {
    const BusBoy = require('busboy')
    const busboy = new BusBoy({headers: req.headers})
    const { user } = req
    
    content = ''

    busboy.on('field', (fieldName, value) => {
        if(fieldName == 'text') {
            content = value
        }
    })

    handleUploadImage(busboy, bucket, (imageName, generatedToken) => {
        let imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageName}?alt=media&token=${generatedToken}`
        if(!imageName) { // There is no image
            imageUrl = ''
        }
        const newPost = postModel({
            authorId: user._id.toString(),
            author: user.username,
            authorImageUrl: user.imageUrl,
            content: content,
            imageUrl: imageUrl,
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

    req.pipe(busboy)
})

// Get a post with specific id
router.get('/:id', (req, res) => {
    const postId = req.params.id
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(404).send("404 Not found")
        }
        post = post.toObject()
        delete post.likes
        delete post.comments
        res.send(post)
    })
})

// Edit a post with specific id
router.put('/:id', (req, res) => {
    const BusBoy = require('busboy')
    const busboy = new BusBoy({headers: req.headers})
    
    const postId = req.params.id
    const { user } = req;
    
    content = ''
    imageStatus = undefined

    busboy.on('field', (fieldName, value) => {
        if(fieldName == 'text') {
            content = value
        }
        else if(fieldName == 'imageStatus') {
            imageStatus = value
        }
    })

    handleUploadImage(busboy, bucket, (imageName, generatedToken) => {
        let imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageName}?alt=media&token=${generatedToken}`
        postModel.findById(postId, (err, post) => {
            if(err || !post) {
                return res.status(404).send("404 Not found")
            }
            if(user._id.toString() !== post.authorId.toString()) {
                return res.status(403).send("You don't have permission to edit this post")         
            }

            oldImageName = undefined
            if(post.imageUrl) {
                oldImageName = post.imageUrl.toString().split('/')[7].split('?')[0]
            }
            post.content = content
            if(imageStatus == 'removed') {
                post.imageUrl = ''
            }
            else if(imageStatus == 'changed') {
                post.imageUrl = imageUrl
            }

            post.save((err, newPost) => {
                if(err) {
                    console.log(err)
                    return res.status(500).send("Error occured")
                }
                res.send(newPost)

                // Delete old image from firebase
                if(imageStatus !== 'unchanged' && oldImageName) {
                    bucket
                        .file(oldImageName)
                        .delete()
                }
            })
        })
    })

    req.pipe(busboy)
})

// Delete a post with specific id
router.delete('/:id', (req, res) => {
    const postId = req.params.id
    const { user } = req;
    postModel.findById(postId, (err, post) => {
        if(err || !post) {
            return res.status(404).send("404 Not found")
        }
        if(user._id.toString() !== post.authorId.toString()) {
            return res.status(403).send("You don't have permission to delete this post")    
        }
        postModel.deleteOne({_id: post._id}, (err) => {
            res.send("You have deleted a post")
        })
    })
})



module.exports = router