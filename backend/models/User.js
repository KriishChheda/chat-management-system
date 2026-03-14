const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
// the collection name is 'users' because mongoose automatically pluralizes the model name.
// every user is one document in the 'users' collection in the database.