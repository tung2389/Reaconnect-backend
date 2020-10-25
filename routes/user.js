const express = require('express')
const config = require('../config/firebaseConfig')
const { bucket } = require('../config/admin')
const handleUploadImage = require('../controller/handleUploadImage')
const userModel = require('../model/user')
const jwtAuthenticate = require('../middleware/jwtAuthenticate')

const router = express.Router()
router.use(jwtAuthenticate)

// Get user profile
router.get('/', (req, res) => {
    const { user } = req
    userModel.findById(user._id, (err, userData) => {
        if(err || !userData) {
            return res.status(404).send("404 Not found")
        }
        res.send(userData)
    })
})


// Get user profile with id
router.get('/:id', (req, res) => {
	let userId = req.params.id
	userModel.findById(userId, (err, user) => {
		if(err || !user) {
            return res.status(400).send("Errors occur. Please try again later")
		}
		res.send(user);
	})
})


// Upload profile image
router.post('/image', (req, res) => {
    const BusBoy = require('busboy')
    const busboy = new BusBoy({headers: req.headers})

    handleUploadImage(busboy, bucket, (imageName, generatedToken) => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageName}?alt=media&token=${generatedToken}`
        const { user } = req
        userModel.findOneAndUpdate(
            {_id: user._id}, 
            {imageUrl: imageUrl},
            {new: false}, // Get the old user to take the oldImageName
            (err, user) => {
                user = user.toObject()
                oldImageName = user.imageUrl.toString().split('/')[7].split('?')[0]

                // Modify the imageUrl in newUser
                newUser = user
                newUser.imageUrl = imageUrl
                delete newUser.password // Remove the password field
                res.send(newUser)

                // Delete old image from firebase
                if(oldImageName) {
                    bucket
                        .file(oldImageName)
                        .delete()
                }
            }
        )
    })
    req.pipe(busboy)
})

module.exports = router