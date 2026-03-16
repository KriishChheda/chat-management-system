const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');
const multer = require('multer');

// Configure Multer to store files in memory temporarily 
// so we can forward them to the Python server (port 5003)
const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.post('/signup', chatController.signup);
router.post('/login', chatController.login);

// Protected routes (Require 'auth' middleware)
router.get('/messages/:chatId', auth, chatController.getMessagesByChatId);
router.post('/chat', auth, chatController.sendMessage);
router.get('/chat-list', auth, chatController.getChatList);

// --- NEW RAG ROUTE ---
// Use 'upload.single("file")' to process the file from the frontend request
router.post('/upload-doc', auth, upload.single('file'), chatController.uploadDocument);
router.delete('/chat/:chatId', auth, chatController.deleteChat);
module.exports = router;

// you define all the routes and return the router object at the end to our server.js file, which will use these routes to handle incoming requests. Each route is linked to a specific controller function that contains the logic for that route.

// we import the controllers which have the logic to handle the requests.


