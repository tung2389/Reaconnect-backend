const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
      email: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      username: {
        type: String,
        required: true
      },
      verified: {
        type: Boolean,
        required: true
      },
      createdAt: {
        type: Date,
        required: true
      }
});

userSchema.index( { createdAt: 1 }, { expireAfterSeconds: 3600 * 24 * 1, partialFilterExpression: { verified: false } })

const user = mongoose.model('user', userSchema)

module.exports = user;