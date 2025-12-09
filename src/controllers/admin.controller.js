
const asyncHandler = require('../utils/asyncHandler');
const adminService = require('../services/admin.service');
const authService = require('../services/auth.service');
const marketWindowStockService = require('../services/marketWindowStock.service');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Admin Controller
 * Handles admin requests
 */
class AdminController {
  /**
   * Admin Login
   * POST /api/admin/login
   */
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    try {
      const result = await authService.adminLogin({ email, password });
      
      return successResponse(res, result, 'Admin login successful');
    } catch (error) {
      return errorResponse(res, error.message, 401);
    }
  });

  /**
   * Get Current Admin
   * GET /api/admin/me
   */
  getMe = asyncHandler(async (req, res) => {
    const result = await authService.getMe(req.user._id);
    
    return successResponse(res, { user: result }, 'Admin retrieved successfully');
  });

  /**
   * Get Dashboard Statistics
   * GET /api/admin/dashboard/stats
   */
  getDashboardStats = asyncHandler(async (req, res) => {
    const result = await adminService.getDashboardStats();
    
    return successResponse(res, result, 'Dashboard stats retrieved successfully');
  });

  /**
   * Get Current Market Gainers
   * GET /api/admin/market/current/gainers?page=1&limit=20
   */
  getCurrentMarketGainers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    if (page < 1) {
      return errorResponse(res, 'Page must be greater than 0', 400);
    }

    const result = await marketWindowStockService.getCurrentMarketGainers(page, limit);
    
    return successResponse(res, result, 'Current market gainers retrieved successfully');
  });

  /**
   * Get Current Market Losers
   * GET /api/admin/market/current/losers?page=1&limit=20
   */
  getCurrentMarketLosers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    if (page < 1) {
      return errorResponse(res, 'Page must be greater than 0', 400);
    }

    const result = await marketWindowStockService.getCurrentMarketLosers(page, limit);
    
    return successResponse(res, result, 'Current market losers retrieved successfully');
  });

  /**
   * Get Pre-Market Gainers
   * GET /api/admin/market/pre/gainers?page=1&limit=20
   */
  getPreMarketGainers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    if (page < 1) {
      return errorResponse(res, 'Page must be greater than 0', 400);
    }

    const result = await marketWindowStockService.getPreMarketGainers(page, limit);
    
    return successResponse(res, result, 'Pre-market gainers retrieved successfully');
  });

  /**
   * Get Pre-Market Losers
   * GET /api/admin/market/pre/losers?page=1&limit=20
   */
  getPreMarketLosers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    if (page < 1) {
      return errorResponse(res, 'Page must be greater than 0', 400);
    }

    const result = await marketWindowStockService.getPreMarketLosers(page, limit);
    
    return successResponse(res, result, 'Pre-market losers retrieved successfully');
  });

  /**
   * Get After-Market Gainers
   * GET /api/admin/market/after/gainers?page=1&limit=20
   */
  getAfterMarketGainers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    if (page < 1) {
      return errorResponse(res, 'Page must be greater than 0', 400);
    }

    const result = await marketWindowStockService.getAfterMarketGainers(page, limit);
    
    return successResponse(res, result, 'After-market gainers retrieved successfully');
  });

  /**
   * Get After-Market Losers
   * GET /api/admin/market/after/losers?page=1&limit=20
   */
  getAfterMarketLosers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    if (page < 1) {
      return errorResponse(res, 'Page must be greater than 0', 400);
    }

    const result = await marketWindowStockService.getAfterMarketLosers(page, limit);
    
    return successResponse(res, result, 'After-market losers retrieved successfully');
  });

  /**
   * Get Single Market Stock
   * GET /api/admin/market/:marketType/stocks/:id
   */
  getMarketStock = asyncHandler(async (req, res) => {
    const { marketType, id } = req.params;

    try {
      const stock = await marketWindowStockService.getMarketStockById(marketType, id);
      return successResponse(res, stock, 'Market stock retrieved successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return errorResponse(res, error.message, 404);
      }
      if (error.message.includes('Invalid market type')) {
        return errorResponse(res, error.message, 400);
      }
      throw error;
    }
  });

  /**
   * Create Market Stock
   * POST /api/admin/market/:marketType/stocks
   */
  createMarketStock = asyncHandler(async (req, res) => {
    const { marketType } = req.params;
    const { symbol, name, price, change, changePercent, volume } = req.body;

    // Validation
    if (!symbol || !name || price === undefined) {
      return errorResponse(res, 'Symbol, name, and price are required', 400);
    }

    try {
      const stock = await marketWindowStockService.createMarketStock(marketType, {
        symbol,
        name,
        price,
        change,
        changePercent,
        volume
      });
      
      return successResponse(res, stock, 'Market stock created successfully', 201);
    } catch (error) {
      if (error.message.includes('Invalid market type')) {
        return errorResponse(res, error.message, 400);
      }
      throw error;
    }
  });

  /**
   * Update Market Stock
   * PUT /api/admin/market/:marketType/stocks/:id
   */
  updateMarketStock = asyncHandler(async (req, res) => {
    const { marketType, id } = req.params;
    const stockData = req.body;

    try {
      const stock = await marketWindowStockService.updateMarketStock(marketType, id, stockData);
      return successResponse(res, stock, 'Market stock updated successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return errorResponse(res, error.message, 404);
      }
      if (error.message.includes('Invalid market type')) {
        return errorResponse(res, error.message, 400);
      }
      throw error;
    }
  });

  /**
   * Delete Market Stock
   * DELETE /api/admin/market/:marketType/stocks/:id
   */
  deleteMarketStock = asyncHandler(async (req, res) => {
    const { marketType, id } = req.params;

    try {
      const result = await marketWindowStockService.deleteMarketStock(marketType, id);
      return successResponse(res, result, 'Market stock deleted successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return errorResponse(res, error.message, 404);
      }
      if (error.message.includes('Invalid market type')) {
        return errorResponse(res, error.message, 400);
      }
      throw error;
    }
  });

  /**
   * Get All Users
   * GET /api/admin/users?page=1&limit=20&role=user&isActive=true
   */
  getUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const role = req.query.role || 'user'; // Filter by role
    const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;

    if (page < 1) {
      return errorResponse(res, 'Page must be greater than 0', 400);
    }

    const result = await adminService.getUsers(page, limit, { role, isActive });
    
    return successResponse(res, result, 'Users retrieved successfully');
  });

  /**
   * Get Single User
   * GET /api/admin/users/:id
   */
  getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      const user = await adminService.getUserById(id);
      return successResponse(res, { user }, 'User retrieved successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return errorResponse(res, error.message, 404);
      }
      throw error;
    }
  });

  /**
   * Update User Status (Activate/Deactivate)
   * PATCH /api/admin/users/:id/status
   */
  updateUserStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return errorResponse(res, 'isActive must be a boolean value', 400);
    }

    try {
      const user = await adminService.updateUserStatus(id, isActive);
      return successResponse(res, { user }, `User ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      if (error.message.includes('not found')) {
        return errorResponse(res, error.message, 404);
      }
      throw error;
    }
  });

  /**
   * Update User
   * PUT /api/admin/users/:id
   */
  updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, role, isActive } = req.body;

    // Validation
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return errorResponse(res, 'Invalid email format', 400);
    }

    if (role && !['admin', 'user'].includes(role)) {
      return errorResponse(res, 'Role must be either "admin" or "user"', 400);
    }

    if (isActive !== undefined && typeof isActive !== 'boolean') {
      return errorResponse(res, 'isActive must be a boolean value', 400);
    }

    try {
      const user = await adminService.updateUser(id, { name, email, role, isActive });
      return successResponse(res, { user }, 'User updated successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return errorResponse(res, error.message, 404);
      }
      if (error.message.includes('already exists')) {
        return errorResponse(res, error.message, 409);
      }
      throw error;
    }
  });

  /**
   * Delete User (Soft Delete)
   * DELETE /api/admin/users/:id
   */
  deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      const result = await adminService.deleteUser(id);
      return successResponse(res, result, 'User deleted successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        return errorResponse(res, error.message, 404);
      }
      throw error;
    }
  });

  /**
   * Admin Signup
   * POST /api/admin/signup
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

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return errorResponse(res, 'Invalid email format', 400);
    }

    try {
      const result = await adminService.createAdmin({ name, email, password });
      
      return successResponse(
        res,
        result,
        'Admin registered successfully',
        201
      );
    } catch (error) {
      if (error.message.includes('already exists')) {
        return errorResponse(res, error.message, 409);
      }
      throw error;
    }
  });
}

module.exports = new AdminController();

