const express = require('express')
const config = require('../config/firebaseConfig')
const { bucket } = require('../config/admin')
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
    const path = require('path')
    const os = require('os')
    const fs = require('fs')
    const { v4: uuidv4 } = require('uuid');

    const busboy = new BusBoy({headers: req.headers})

    let imagePath
    let imageName
    let imageMimetype
    const generatedToken = uuidv4()

    busboy.on('file', (fieldName, file, fileName, encoding, mimetype) => {

        if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
            return res.status(400).send("Image's file format is not accepted")
        }

        imageExtension = fileName.split('.')[fileName.split('.').length - 1]
        imageMimetype = mimetype
        imageName = `${uuidv4()}.${imageExtension}`        
        imagePath = path.join(os.tmpdir(), imageName)
        file.pipe(fs.createWriteStream(imagePath))
    })

    busboy.on('finish', () => {
        bucket.upload(
            imagePath,
            {
                metadata: {
                    metadata: {
                        firebaseStorageDownloadTokens: generatedToken,
                    },
                    contentType: imageMimetype
                }
            }
        ).then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageName}?alt=media&token=${generatedToken}`
            const { user } = req
            userModel.findOneAndUpdate(
                {_id: user._id}, 
                {imageUrl: imageUrl},
                {new: true},
                (err, user) => {
                    user = user.toObject()
                    delete user.password
                    res.send(user)
                }
            )
        })
    })
    req.pipe(busboy)
})

module.exports = router