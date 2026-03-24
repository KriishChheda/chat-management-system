const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');
const multer = require('multer');

// Store files in memory so we can forward them to the RAG server (port 5003)
const upload = multer({ storage: multer.memoryStorage() });

// --- Public routes ---
router.post('/signup', chatController.signup);
router.post('/login', chatController.login);

// --- Protected routes (require JWT via 'auth' middleware) ---

// Create a new chat (registers chat on RAG server + gets back a chatId)
router.post('/new-chat', auth, chatController.createChat);

// Get list of all chatIds for the logged-in user
router.get('/chat-list', auth, chatController.getChatList);

// Get message history for a specific chat
router.get('/messages/:chatId', auth, chatController.getMessagesByChatId);

// Send a message (proxied to RAG server for LLM + vector search)
router.post('/chat', auth, chatController.sendMessage);

// Upload a document to a specific chat's vector DB
// 'chatId' is sent as a form field alongside the file
router.post('/upload-doc', auth, upload.single('file'), chatController.uploadDocument);

// Delete a chat (removes from MongoDB + RAG vector DB)
router.delete('/chat/:chatId', auth, chatController.deleteChat);

module.exports = router;
