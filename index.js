const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const cors = require('cors');
require('./config/passport')(passport);
require('dotenv').config()

const login = require('./routes/login')
const signup = require('./routes/signup')

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

app.get("/",(req,res) => {
    res.send('Hello');
})
app.use("/api/login", login)
app.use("/api/signup", signup)

app.listen(PORT, function() {
    console.log(`Server is running at port ${PORT}`)
})