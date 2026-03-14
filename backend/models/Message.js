// each file inside the models folder is a model, which is a representation of a table in the database
// we create the schema followed by the model of that schema.

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chatId: { type: String, required: true }, // Every messsage belongs to a particular chat
  text: { type: String, required: true },
  isUser: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);

// const model = mongoose.model('Message', messageSchema);
// module.exports = model;