const express = require('express');
const router = express.Router();
const { addMessage, getMessages } = require('../controllers/MessageController');

router.post('/new', addMessage);
router.post('/retrieve', getMessages);

module.exports = router;
