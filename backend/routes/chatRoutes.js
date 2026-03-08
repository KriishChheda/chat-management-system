const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/messages/:chatId', chatController.getMessagesByChatId);
router.delete('/messages/:chatId', chatController.deleteChat);
router.post('/chat', chatController.sendMessage);
router.get('/chat-list', chatController.getChatList);
module.exports = router;

// you define all the routes and return the router object at the end to our server.js file, which will use these routes to handle incoming requests. Each route is linked to a specific controller function that contains the logic for that route.

// we import the controllers which have the logic to handle the requests.


