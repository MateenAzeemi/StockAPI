const authMiddleware = require('./auth.middleware');
const { errorResponse } = require('../utils/response');

/**
 * Admin Middleware
 * Checks if user is authenticated AND has admin role
 */
const adminMiddleware = async (req, res, next) => {
  // First check authentication
  authMiddleware(req, res, () => {
    // Check if user has admin role
    if (!req.user || req.user.role !== 'admin') {
      return errorResponse(res, 'Forbidden: Admin access required', 403);
    }
    
    next();
  });
};

module.exports = adminMiddleware;

