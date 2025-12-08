const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const userAuth = require('../middleware/userAuth');

/**
 * User Auth Routes
 * User authentication endpoints (signup/login)
 */

// POST /api/auth/signup - User signup
router.post('/signup', authController.signup);

// POST /api/auth/login - User login
router.post('/login', authController.login);

// GET /api/auth/me - Get current user (protected)
router.get('/me', userAuth, authController.getMe);

module.exports = router;
