const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const cors = require('cors');
const path = require('path');
require('./config/passport')(passport);
require('dotenv').config()

const login = require('./routes/login')
const signup = require('./routes/signup')
const verify = require('./routes/verify')
const newpost = require('./routes/newpost')
const post = require('./routes/post')
const posts = require('./routes/posts')
const profile = require('./routes/profile')

const app = express();

const MONGO_URL = process.env.MONGO_URL
const PORT = process.env.PORT || 3001

mongoose.connect(
    MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, err => {
        if(err) {
            throw err;
        }
        console.log("Successfully connect to database")
    }
)
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use("/api/login", login)
app.use("/api/signup", signup)
app.use("/api/verify", verify)
app.use("/api/newpost", newpost)
app.use("/api/post", post)
app.use("/api/posts", posts)
app.use("/api/profile", profile)

app.use(express.static(path.join(__dirname, '/build')));
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname, '/build/index.html'));
});

app.listen(PORT, function() {
    console.log(`Server is running at port ${PORT}`)
})