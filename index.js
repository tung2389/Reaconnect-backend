const express = require('express')
const mongoose = require('mongoose')
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
app.get('/',(req,res) => {
    res.send('Hello');
})
app.listen(PORT, function() {
    console.log(`Server is running at port ${PORT}`)
})