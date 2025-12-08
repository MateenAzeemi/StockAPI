const jwt = require('jsonwebtoken');

/**
 * JWT Utility Functions
 * Handles token generation and verification
 */

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in token
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret-change-in-production'
    );
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Generate refresh token
 * @param {Object} payload - Data to encode
 * @returns {String} Refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    {
      expiresIn: '30d' // Longer expiry for refresh token
    }
  );
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken
};

