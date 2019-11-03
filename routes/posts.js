const express = require('express')
const passport = require('passport')
const postModel = require('../model/post')

const router = express.Router();
router.get('/', (req, res, next) => {
    passport.authenticate('jwt', {session: false}, (err, user) => {
        if(err) {
            return res.status(400).json({
                message: "Error occured"
            })
        }
        if(!user) {
            return res.status(400).json({
                message: "You must logged in first"
            })
        }
        const { lastDate, limit } = req.query;
        postModel.find({createdAt: {$lt: lastDate}})
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
    })(req, res, next)
})

module.exports = router