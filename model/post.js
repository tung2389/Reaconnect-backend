const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    authorId: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    likes: {
        type: Array,
        required: true
    },
    likeCount: {
        type: Number,
        required: true
    },
    comments: {
        type: Array,
        required: true,
    },
    commentCount: {
        type: Number,
        required: true
    }
})

const post = mongoose.model('post', postSchema)
module.exports = post