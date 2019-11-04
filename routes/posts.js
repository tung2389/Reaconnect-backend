const express = require('express')
const passport = require('passport')
const postModel = require('../model/post')
const jwtAuthenticate = require('../middleware/jwtAuthenticate')

const router = express.Router();
router.get('/', jwtAuthenticate, (req, res) => {
    const { lastDate, limit } = req.query;
    postModel
        .find({createdAt: {$lt: lastDate}})
        .sort({createdAt: -1})
        .limit(Number(limit))
        .then(data => {
        res.send(data)
        })
        .catch(err => {
        res.status(400).json({
            message: "Error occured"
        })
        })
})

module.exports = router