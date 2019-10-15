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
      verified: {
        type: Boolean,
        required: true
      },
      createdAt: {
        type: Date,
        required: true
      }
});

userSchema.index( { createdAt: 1 }, { expireAfterSeconds: 120, partialFilterExpression: { verified: false } })

const user = mongoose.model('user', userSchema)

module.exports = user;