const express = require('express')
const sendMail = require('../controller/sendMail')

const router = express.Router()

router.post('/', (req, res) => {
    const { email, password } = req.body
    sendMail(email)
})

module.exports = router