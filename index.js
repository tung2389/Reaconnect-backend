const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const jwt = require('jsonwebtoken')
require('./config/passport')(passport);
require('dotenv').config()

const app = express();

const MONGO_URL = process.env.MONGO_URL
const PORT = process.env.PORT || 3001

mongoose.connect(
    MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        if(err) {
            throw err;
        }
        console.log("Successfully connect to database")
    }
)

app.use(passport.initialize());

app.get("/",(req,res) => {
    res.send('Hello');
})

app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", {session: false}, (err, user, info) => {
        if(err || !user) {
            return res.status(400).json({
                message: info
            })
        }
        //Not use session, so there is no need to use req.login()
        const jwtToken = jwt.sign({id: user.id}, process.env.JWT_SECRET)
        return res.status(200).json({jwtToken})
    })(req, res, next)
});

// app.post()
app.listen(PORT, function() {
    console.log(`Server is running at port ${PORT}`)
})