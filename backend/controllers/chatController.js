// Add this right after your imports in chatController.js
const Message = require('../models/Message');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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
  const user = await User.findOne({ username: req.body.username });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ message: "Auth failed" });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: "1h" });
  res.json({ token, userId: user._id });
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
exports.sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;
    const userId = req.userData.userId;
    // 1. Fetch existing history for this specific chatId from your DB
    const history = await Message.find({ chatId, userId }).sort({ timestamp: 1 });

    // 2. Format history for Gemini (it expects 'user' and 'model' roles)
    const formattedHistory = history.map(msg => ({ role: msg.isUser ? "user" : "model", parts: [{ text: msg.text }] }));

    // 3. Start a chat session with the loaded his tory
    const chatSession = model.startChat({ history: formattedHistory });

    // 4. Save the NEW user message to your DB
    await Message.create({ text: message, isUser: true, chatId, userId });

    // 5. Send the new message through the session
    const result = await chatSession.sendMessage(message);
    const botReply = result.response.text();

    // 6. Save the AI response to your DB
await Message.create({ text: botReply, isUser: false, chatId, userId });

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
};