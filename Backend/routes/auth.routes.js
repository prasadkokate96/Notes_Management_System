const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// below i Create a  simple login route without extra middleware that could interfere
router.post('/login', authController.login);

// Public routes
router.post('/register', authController.register);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.post('/refresh-token', authMiddleware, authController.refreshToken);

module.exports = router;