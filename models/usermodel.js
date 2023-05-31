const mongoose = require('mongoose');

// define a user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// create a user model
const User = mongoose.model('User', userSchema);

module.exports = User;