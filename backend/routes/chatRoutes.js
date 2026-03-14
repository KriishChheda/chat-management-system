const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// Public routes
router.post('/signup', chatController.signup);
router.post('/login', chatController.login);

// Protected routes (Require 'auth' middleware)
router.get('/messages/:chatId', auth, chatController.getMessagesByChatId);
router.post('/chat', auth, chatController.sendMessage);
router.get('/chat-list', auth, chatController.getChatList);

module.exports = router;

// you define all the routes and return the router object at the end to our server.js file, which will use these routes to handle incoming requests. Each route is linked to a specific controller function that contains the logic for that route.

// we import the controllers which have the logic to handle the requests.


