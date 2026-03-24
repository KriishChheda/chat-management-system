const Message = require('../models/Message');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const FormData = require('form-data');

const RAG_SERVER_URL = process.env.RAG_SERVER_URL || 'http://localhost:5003';

// ─── Helper: register a user in the RAG server's DB, return RAG userId ───────
// Called ONCE during signup. Uses @ragchat.com (a real TLD, passes Pydantic EmailStr).
async function createRagUser(username) {
  const ragEmail = `${username.replace(/[^a-zA-Z0-9]/g, '_')}@ragchat.com`;
  try {
    const res = await axios.post(`${RAG_SERVER_URL}/api/users`, {
      email: ragEmail,
      user_type: 'USER',
    });
    console.log(`[RAG] Created RAG user for "${username}" (${ragEmail}) → ${res.data.user_id}`);
    return res.data.user_id;
  } catch (err) {
    if (err.response?.status === 409) {
      // Already exists — look up by email
      try {
        const getRes = await axios.get(`${RAG_SERVER_URL}/api/users/email/${encodeURIComponent(ragEmail)}`);
        return getRes.data.user._id;
      } catch (getErr) {
        console.error('[RAG] Lookup failed after 409:', getErr.message);
      }
    }
    console.error('[RAG] createRagUser failed:', err.response?.data || err.message);
    return null;
  }
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
exports.signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Register user in RAG server FIRST to get the ragUserId
    const ragUserId = await createRagUser(req.body.username);

    // Save user in our MongoDB with the ragUserId
    await User.create({
      username: req.body.username,
      password: hashedPassword,
      ragUserId: ragUserId || null,
    });

    res.status(201).json({ message: "User created. Please log in." });
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

    // If somehow ragUserId is missing (e.g., user created before this feature),
    // try to create/fetch it now and persist it.
    let ragUserId = user.ragUserId;
    if (!ragUserId) {
      ragUserId = await createRagUser(req.body.username);
      if (ragUserId) {
        await User.findByIdAndUpdate(user._id, { ragUserId });
      }
    }

    const token = jwt.sign(
      { userId: user._id, ragUserId },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: "24h" }
    );

    res.json({ token, userId: user._id, ragUserId });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Login error" });
  }
};

// ─── CHAT CRUD ────────────────────────────────────────────────────────────────

/**
 * Creates a new chat on the RAG server (which sets up a per-chat vector DB).
 * Uses the ragUserId from the auth token to satisfy the RAG server's user check.
 */
exports.createChat = async (req, res) => {
  try {
    const ragUserId = req.userData.ragUserId;
    const title = req.body.title || `Chat ${new Date().toLocaleString()}`;

    if (!ragUserId) {
      return res.status(400).json({ error: "RAG user ID not found in token. Please log in again." });
    }

    const ragResponse = await axios.post(`${RAG_SERVER_URL}/api/chats`, {
      userId: ragUserId,
      title,
    });

    const chatId = ragResponse.data.chat_id;
    res.status(201).json({ chatId, title });
  } catch (error) {
    console.error("Create Chat Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create chat on RAG server" });
  }
};

/**
 * Returns all unique chatIds for the logged-in user (from MongoDB message history).
 */
exports.getChatList = async (req, res) => {
  try {
    const chatIds = await Message.find({ userId: req.userData.userId }).distinct("chatId");
    res.json(chatIds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Returns all messages for a specific chatId (full conversation history).
 */
exports.getMessagesByChatId = async (req, res) => {
  try {
    const messages = await Message.find({
      chatId: req.params.chatId,
      userId: req.userData.userId,
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Sends user's message to the RAG server for processing, saves both the
 * user message and the AI reply (with citations) to MongoDB.
 */
exports.sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;
    const userId = req.userData.userId;
    const ragUserId = req.userData.ragUserId;

    if (!message || !chatId) {
      return res.status(400).json({ error: "message and chatId are required" });
    }

    // 1. Save user message to MongoDB immediately
    await Message.create({ text: message, isUser: true, chatId, userId });

    // 2. Forward to RAG server
    let ragData;
    try {
      const ragResponse = await axios.post(
        `${RAG_SERVER_URL}/api/chats/${chatId}/prompt`,
        { prompt: message, userId: ragUserId }
      );
      ragData = ragResponse.data;
    } catch (ragErr) {
      console.error("RAG Server Error:", ragErr.response?.data || ragErr.message);
      return res.status(503).json({
        error: "RAG server is unavailable. Make sure it's running on port 5003."
      });
    }

    const botReply = ragData.response || "I couldn't generate a response.";
    const rawCitations = ragData.citations || [];

    // Normalize citations: RAG returns objects {citationId, source, text, page, link}
    // but our Message schema stores citations as [String]. Extract the source filename.
    const citationStrings = rawCitations.map(c =>
      typeof c === 'string' ? c : (c.source || c.citationId || JSON.stringify(c))
    );

    // 3. Save AI reply to MongoDB
    await Message.create({ text: botReply, isUser: false, chatId, userId, citations: citationStrings });

    // 4. Return to frontend — send the full objects so UI can show rich citations
    res.json({ reply: botReply, citations: rawCitations });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
};

/**
 * Forwards a file to the chat-specific RAG endpoint.
 * The RAG server chunks, embeds, and stores it in that chat's ChromaDB collection.
 */
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    const chatId = req.body.chatId;
    if (!chatId) {
      return res.status(400).json({ error: "chatId is required alongside the file" });
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(
      `${RAG_SERVER_URL}/api/chats/${chatId}/upload`,
      formData,
      { headers: { ...formData.getHeaders() } }
    );

    res.status(200).json({
      message: "Document uploaded and processed by RAG server",
      data: response.data,
    });
  } catch (error) {
    console.error("RAG Upload Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to upload document to RAG server" });
  }
};

/**
 * Deletes all MongoDB messages for this chat and cleans up the RAG vector DB.
 */
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    await Message.deleteMany({ chatId });

    // Best-effort cleanup of RAG vector DB (non-fatal if it fails)
    try {
      await axios.delete(`${RAG_SERVER_URL}/api/chats/${chatId}`);
    } catch (ragErr) {
      console.warn("RAG chat delete (non-fatal):", ragErr.message);
    }

    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};