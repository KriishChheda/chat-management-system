// Add this right after your imports in chatController.js
const Message = require('../models/Message');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const FormData = require('form-data');

console.log("DEBUG: API Key length is:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : "0 (MISSING)");

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // here we craeted an object that defines the connection between Gemini and Node.js. We will use this object to send requests to Gemini and get responses back.
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});


// --- AUTH LOGIC ---
exports.signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ username: req.body.username, password: hashedPassword });
    // this statement here will create an error and throw it back to the catch block if the user with the same username already exists because of the unique constraint we set in the User model.
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ error: "User already exists or server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ message: "Auth failed" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: "1h" });
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: "Login error" });
  }
};

exports.getMessagesByChatId = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId, userId: req.userData.userId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChatList = async (req, res) => {
  try {
    // Finds unique chatId values in the Message collection
    const chatIds = await Message.find({ userId: req.userData.userId }).distinct("chatId");
    res.json(chatIds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a specific chat
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    await Message.deleteMany({ chatId });
    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logic to send a new message
// exports.sendMessage = async (req, res) => {
//   try {
//     const { message, chatId } = req.body;
//     const userId = req.userData.userId;
//     // 1. Fetch existing history for this specific chatId from your DB
//     const history = await Message.find({ chatId, userId }).sort({ timestamp: 1 });

//     // 2. Format history for Gemini (it expects 'user' and 'model' roles)
//     const formattedHistory = history.map(msg => ({ role: msg.isUser ? "user" : "model", parts: [{ text: msg.text }] }));

//     // 3. Start a chat session with the loaded his tory
//     const chatSession = model.startChat({ history: formattedHistory });

//     // 4. Save the NEW user message to your DB
//     await Message.create({ text: message, isUser: true, chatId, userId });

//     // 5. Send the new message through the session
//     const result = await chatSession.sendMessage(message);
//     const botReply = result.response.text();

//     // 6. Save the AI response to your DB
// await Message.create({ text: botReply, isUser: false, chatId, userId });

//     res.json({ reply: botReply });
//   } catch (error) {
//     console.error("Chat Error:", error);
//     res.status(500).json({ error: "Failed to process chat" });
//   }
// };

// exports.sendMessage = async (req, res) => {
//   const { text, chatId } = req.body;
//   const userId = req.user.id;

//   try {
//     // 1. Save User Message to your MongoDB
//     const userMsg = new Message({ userId, chatId, text, isUser: true });
//     await userMsg.save();

//     // 2. Call the RAG Server on Port 5003
//     const ragResponse = await axios.post('http://localhost:5003/api/chats/chat', {
//       user_id: userId,
//       conversation_id: chatId,
//       prompt: text,
//       collection_name: "default_collection" // Your friend's server uses this to find docs
//     });

//     const { answer, citations } = ragResponse.data;

//     // 3. Save AI Response (with citations) to your MongoDB
//     const aiMsg = new Message({
//       userId,
//       chatId,
//       text: answer,
//       isUser: false,
//       citations: citations // Store the sources found by RAG
//     });
//     await aiMsg.save();

//     res.status(200).json(aiMsg);
//   } catch (error) {
//     console.error("RAG Integration Error:", error);
//     res.status(500).json({ error: "Failed to get response from RAG server" });
//   }
// };

// --- RAG INTEGRATION LOGIC ---

// 1. Sending a message to the RAG server

exports.sendMessage = async (req, res) => {
  // 1. Destructure 'message' because that's what your frontend sends in body
  const { message, chatId } = req.body;
  const userId = req.userData.userId; // Matches your auth.js middleware

  try {
    // 2. Save User Message to your MongoDB
    const userMsg = new Message({ 
      userId, 
      chatId, 
      text: message, // Save the prompt
      isUser: true 
    });
    await userMsg.save();

    // 3. Call the RAG Server on Port 5003
    // We wrap this in a specific try-catch to see if the Python server is the problem
    let ragResponse;
    try {
      ragResponse = await axios.post('http://localhost:5003/api/chats/chat', {
        user_id: userId.toString(),
        conversation_id: chatId,
        prompt: message,
        collection_name: "default_collection" 
      });
    } catch (ragErr) {
      console.error("Python RAG Server Error:", ragErr.message);
      return res.status(503).json({ error: "RAG Server on 5003 is offline or crashed." });
    }

    const { answer, citations } = ragResponse.data;

    // 4. Save AI Response (with citations) to your MongoDB
    const aiMsg = new Message({
      userId,
      chatId,
      text: answer,
      isUser: false,
      citations: citations || []
    });
    await aiMsg.save();

    // 5. Send back what the frontend expects
    res.status(200).json({ 
      reply: answer, 
      citations: aiMsg.citations 
    });
  } catch (error) {
    console.error("General Chat Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// 2. Uploading a document to the RAG server
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const userId = req.userData.userId;

    // Create a Form to send the file to Python
    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);
    formData.append('user_id', userId.toString());

    // Forward to RAG server
    const response = await axios.post('http://localhost:5003/api/docs/upload', formData, {
      headers: { ...formData.getHeaders() }
    });

    res.status(200).json({
      message: "Document successfully uploaded and processed",
      data: response.data
    });
  } catch (error) {
    console.error("RAG Upload Error:", error.message);
    res.status(500).json({ error: "Failed to upload document to RAG server" });
  }
};