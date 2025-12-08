const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');
const User = require('../models/User.model');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided', 401);
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return errorResponse(res, 'No token provided', 401);
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return errorResponse(res, 'Invalid or expired token', 401);
    }

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'User account is deactivated', 401);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Authentication failed', 401);
  }
};

module.exports = authMiddleware;

