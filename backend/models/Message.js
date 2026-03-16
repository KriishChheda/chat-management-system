// each file inside the models folder is a model, which is a representation of a table in the database
// we create the schema followed by the model of that schema.

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chatId: { type: String, required: true }, // Every messsage belongs to a particular chat
  text: { type: String, required: true },
  isUser: { type: Boolean, required: true },
  citations: [{ 
    type: String // Stores filenames like "lesson1.pdf"
  }],
  sourceDocuments: [{
    content: String,
    metadata: Object // Stores page numbers or specific file paths
  }],
  timestamp: { type: Date, default: Date.now }
});

// since i have not specified required:true for citations and sourceDocuments, they will be optional fields in the database. If they are not provided, they will simply be stored as empty arrays.
module.exports = mongoose.model('Message', messageSchema);

// const model = mongoose.model('Message', messageSchema);
// module.exports = model;

//In the context of your chatbot (especially a RAG system), citations are the sources from which the AI got its answer. For example, if the AI is answering a question based on a PDF document, the citation might be the name of that PDF file. This allows you to track where the information came from and can be useful for debugging or providing transparency to users about the sources of the AI's responses.