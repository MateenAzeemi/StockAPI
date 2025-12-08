const config = require('../config');

/**
 * Global Error Handler Middleware
 * Centralized error handling for Express
 * Returns standardized error format: { success: false, message: "...", error: err }
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Default error
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      error: err.message
    });
  }

  // Mongoose Cast Error (Invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
  }

  // Send error response
  const response = {
    success: false,
    message,
    error: err.message || message,
    ...(config.NODE_ENV === 'development' && { 
      stack: err.stack
    }),
    timestamp: new Date().toISOString()
  };

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
