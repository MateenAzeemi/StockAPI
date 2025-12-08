const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Auth Controller
 * Handles authentication requests
 */
class AuthController {
  /**
   * User Signup
   * POST /api/auth/signup
   */
  signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email, and password are required', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters', 400);
    }

    try {
      const result = await authService.signup({ name, email, password });
      
      return successResponse(
        res,
        result,
        'User registered successfully',
        201
      );
    } catch (error) {
      if (error.message.includes('already exists')) {
        return errorResponse(res, error.message, 409);
      }
      throw error;
    }
  });

  /**
   * User Login
   * POST /api/auth/login
   */
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    try {
      const result = await authService.login({ email, password });
      
      return successResponse(res, result, 'Login successful');
    } catch (error) {
      return errorResponse(res, error.message, 401);
    }
  });

  /**
   * Get Current User
   * GET /api/auth/me
   */
  getMe = asyncHandler(async (req, res) => {
    const result = await authService.getMe(req.user._id);
    
    return successResponse(res, { user: result }, 'User retrieved successfully');
  });
}

module.exports = new AuthController();
