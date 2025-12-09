const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const adminAuth = require('../middleware/adminAuth');

/**
 * Admin Routes
 * Admin authentication and market window stock management endpoints
 * All routes require admin authentication except login and signup
 */

// POST /api/admin/signup - Admin signup (public)
router.post('/signup', adminController.signup);

// POST /api/admin/login - Admin login (public)
router.post('/login', adminController.login);

// GET /api/admin/me - Get current admin (protected)
router.get('/me', adminAuth, adminController.getMe);

// GET /api/admin/dashboard/stats - Get dashboard statistics (protected)
router.get('/dashboard/stats', adminAuth, adminController.getDashboardStats);

// Market Window Stocks (Admin Only)
// GET /api/admin/market/current/gainers - Get current market gainers
router.get('/market/current/gainers', adminAuth, adminController.getCurrentMarketGainers);

// GET /api/admin/market/current/losers - Get current market losers
router.get('/market/current/losers', adminAuth, adminController.getCurrentMarketLosers);

// GET /api/admin/market/pre/gainers - Get pre-market gainers
router.get('/market/pre/gainers', adminAuth, adminController.getPreMarketGainers);

// GET /api/admin/market/pre/losers - Get pre-market losers
router.get('/market/pre/losers', adminAuth, adminController.getPreMarketLosers);

// GET /api/admin/market/after/gainers - Get after-market gainers
router.get('/market/after/gainers', adminAuth, adminController.getAfterMarketGainers);

// GET /api/admin/market/after/losers - Get after-market losers
router.get('/market/after/losers', adminAuth, adminController.getAfterMarketLosers);

// Market Stock CRUD (Admin Only)
// GET /api/admin/market/:marketType/stocks/:id - Get single market stock
router.get('/market/:marketType/stocks/:id', adminAuth, adminController.getMarketStock);

// POST /api/admin/market/:marketType/stocks - Create market stock
router.post('/market/:marketType/stocks', adminAuth, adminController.createMarketStock);

// PUT /api/admin/market/:marketType/stocks/:id - Update market stock
router.put('/market/:marketType/stocks/:id', adminAuth, adminController.updateMarketStock);

// DELETE /api/admin/market/:marketType/stocks/:id - Delete market stock
router.delete('/market/:marketType/stocks/:id', adminAuth, adminController.deleteMarketStock);

// User Management (Admin Only)
// GET /api/admin/users - Get all users with pagination
router.get('/users', adminAuth, adminController.getUsers);

// GET /api/admin/users/:id - Get single user
router.get('/users/:id', adminAuth, adminController.getUser);

// PATCH /api/admin/users/:id/status - Update user status (activate/deactivate)
router.patch('/users/:id/status', adminAuth, adminController.updateUserStatus);

// PUT /api/admin/users/:id - Update user
router.put('/users/:id', adminAuth, adminController.updateUser);

// DELETE /api/admin/users/:id - Delete user (soft delete)
router.delete('/users/:id', adminAuth, adminController.deleteUser);

module.exports = router;
