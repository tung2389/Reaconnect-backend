const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('../config/firebaseConfig')
const { bucket } = require('../config/admin')
const { validateEditUserProfile, validateChangePassword } = require('../controller/validateAccount')
const handleUploadImage = require('../controller/handleUploadImage')
const userModel = require('../model/user')
const postModel = require('../model/post')
const jwtAuthenticate = require('../middleware/jwtAuthenticate')

require('dotenv').config()

const router = express.Router()
router.use(jwtAuthenticate)

// Get user profile
router.get('/', (req, res) => {
    const { user } = req
    userModel.findById(
        user._id, 
        {password: 0}, 
        (err, userData) => {
            if(err || !userData) {
                return res.status(404).send("404 Not found")
            }
            res.send(userData)
        }
    )
})

// Edit user profile
router.put('/' ,(req, res) => {
    const { user, body: {username} } = req
    const validation = validateEditUserProfile(username)
    if(validation !== true) {
        return res.status(400).send(validation)
    }
    userModel.findByIdAndUpdate(
        user._id, 
        {username: username},
        {
            new: true,
            fields: {password: 0}
        },
        (err, user) => {
            res.send(user)
        }
    )
})

// Change user password
router.put('/password', async (req, res) => {
    const { user, body: {oldPassword, newPassword, confirmPassword} } = req
    let validation = await validateChangePassword(user._id, oldPassword, newPassword, confirmPassword)
    if(validation !== true) {
        return res.status(400).send(validation)
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(newPassword, salt)
    userModel.findOneAndUpdate(
        {_id: user._id}, 
        {password: hashPassword},
        {new: true},
        () => {
            const jwtToken = jwt.sign(
                {
                    id: user._id,
                    password: hashPassword
                }, 
                process.env.JWT_SECRET
            )
            return res.status(200).json({
                jwtToken: jwtToken,
            })
        }
    )
})

// Get user profile with id
router.get('/:id', (req, res) => {
	const userId = req.params.id
    const user = await userModel
                        .findById(
                            userId, 
                            {
                                 password: 0
                            }
                        )
                        .exec()
    if(!user) {
        return res.status(404).send("404 Not found")
    }
    res.send(user)
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
            {
                new: false,
                fields: {password: 0}
            }, // Get the old user to take the oldImageName
            (err, user) => {
                user = user.toObject()
                oldImageName = user.imageUrl.toString().split('/')[7].split('?')[0]

                // Modify the imageUrl in newUser
                newUser = user
                newUser.imageUrl = imageUrl
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