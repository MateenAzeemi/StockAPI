const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const config = require('../config');
const { errorResponse } = require('../utils/response');

/**
 * User Authentication Middleware
 * Validates JWT token and ensures user has role = "user"
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const userAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header
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
      decoded = jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token expired', 401);
      }
      return errorResponse(res, 'Invalid token', 401);
    }

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'User account is deactivated', 401);
    }

    // Check if user has role = "user"
    if (user.role !== 'user') {
      return errorResponse(res, 'Forbidden: User access required', 403);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Authentication failed', 401);
  }
};

module.exports = userAuth;

