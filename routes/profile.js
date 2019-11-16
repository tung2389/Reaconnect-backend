const express = require('express')
const userModel = require('../model//user')
const jwtAuthenticate = require('../middleware/jwtAuthenticate')

const router = express.Router();

router.get('/:id', jwtAuthenticate, (req, res) => {
	let userId = req.params.id
	userModel.findById(userId, (err, user) => {
		if(err || !user) {
            return res.status(400).json({
                message: "Errors occur. Please try again later"
            })
		}
		res.send(user);
	})
})

module.exports = router