const csrf = require('csrf');
const { errorResponse } = require('../utils/response');
const config = require('../config');

/**
 * CSRF Protection Middleware
 * Protects against Cross-Site Request Forgery attacks
 */
const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET requests
  if (req.method === 'GET') {
    return next();
  }

  const tokens = new csrf();
  const secret = config.CSRF_SECRET;
  
  // Get token from header or body
  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionSecret = req.session?.csrfSecret || secret;

  if (!token) {
    return errorResponse(res, 'CSRF token missing', 403);
  }

  // Verify token
  if (!tokens.verify(sessionSecret, token)) {
    return errorResponse(res, 'Invalid CSRF token', 403);
  }

  next();
};

/**
 * Generate CSRF token
 * @param {Object} req - Express request
 * @returns {String} CSRF token
 */
const generateCSRFToken = (req) => {
  const tokens = new csrf();
  const secret = config.CSRF_SECRET;
  
  // Store secret in session (if using sessions) or use fixed secret
  if (req.session) {
    if (!req.session.csrfSecret) {
      req.session.csrfSecret = secret;
    }
    return tokens.create(req.session.csrfSecret);
  }
  
  return tokens.create(secret);
};

module.exports = {
  csrfProtection,
  generateCSRFToken
};

