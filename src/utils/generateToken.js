const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generate JWT Token
 * Creates a JWT token with user data
 * 
 * @param {Object} user - User object with id, email, role
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user.id || user._id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE || '7d'
  });
};

module.exports = generateToken;

