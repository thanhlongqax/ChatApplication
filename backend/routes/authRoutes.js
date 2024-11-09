const express = require('express');
const router = express.Router();
const { login, register, getAllUsers, logOut } = require('../controllers/AuthController');

router.post('/login', login);
router.post('/signup', register);
router.get('/users/:id', getAllUsers);
router.get('/signout/:id', logOut);

module.exports = router;
