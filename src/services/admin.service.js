const PreMarketStock = require('../models/PreMarketStock.model');
const CurrentMarketStock = require('../models/CurrentMarketStock.model');
const AfterMarketStock = require('../models/AfterMarketStock.model');
const User = require('../models/User.model');

/**
 * Admin Service
 * Business logic for admin operations
 */
class AdminService {
  /**
   * Get dashboard statistics
   * @returns {Object} Dashboard stats
   */
  async getDashboardStats() {
    try {
      const [preMarketTotal, currentMarketTotal, afterMarketTotal, lastUpdated] = await Promise.all([
        PreMarketStock.countDocuments(),
        CurrentMarketStock.countDocuments(),
        AfterMarketStock.countDocuments(),
        Promise.all([
          PreMarketStock.findOne().sort({ lastUpdated: -1 }).select('lastUpdated').lean(),
          CurrentMarketStock.findOne().sort({ lastUpdated: -1 }).select('lastUpdated').lean(),
          AfterMarketStock.findOne().sort({ lastUpdated: -1 }).select('lastUpdated').lean()
        ]).then(results => {
          const dates = results.map(r => r?.lastUpdated).filter(Boolean);
          return dates.length > 0 ? new Date(Math.max(...dates.map(d => new Date(d)))) : null;
        })
      ]);

      return {
        preMarketStocks: preMarketTotal,
        currentMarketStocks: currentMarketTotal,
        afterMarketStocks: afterMarketTotal,
        totalStocks: preMarketTotal + currentMarketTotal + afterMarketTotal,
        lastUpdated
      };
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Get all users with pagination and filters
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @param {Object} filters - Filter options (role, isActive)
   * @returns {Object} Paginated users
   */
  async getUsers(page, limit, filters = {}) {
    try {
      const { role, isActive } = filters;
      
      // Build query
      const query = {};
      if (role) {
        query.role = role;
      }
      if (isActive !== undefined) {
        query.isActive = isActive;
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Get users and total count
      const [users, total] = await Promise.all([
        User.find(query)
          .select('-password')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {String} userId - User ID
   * @returns {Object} User
   */
  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        throw new Error('User not found');
      }

      return user.toJSON();
    } catch (error) {
      if (error.message === 'User not found') {
        throw error;
      }
      console.error('❌ Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }

  /**
   * Update user status (activate/deactivate)
   * @param {String} userId - User ID
   * @param {Boolean} isActive - Active status
   * @returns {Object} Updated user
   */
  async updateUserStatus(userId, isActive) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw new Error('User not found');
      }

      return user.toJSON();
    } catch (error) {
      if (error.message === 'User not found') {
        throw error;
      }
      console.error('❌ Error updating user status:', error);
      throw new Error('Failed to update user status');
    }
  }

  /**
   * Update user
   * @param {String} userId - User ID
   * @param {Object} userData - User data to update (name, email, role, isActive)
   * @returns {Object} Updated user
   */
  async updateUser(userId, userData) {
    try {
      const { name, email, role, isActive } = userData;

      // Build update object
      const updateData = { updatedAt: new Date() };
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (role !== undefined) updateData.role = role;
      if (isActive !== undefined) updateData.isActive = isActive;

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw new Error('User not found');
      }

      return user.toJSON();
    } catch (error) {
      if (error.message === 'User not found') {
        throw error;
      }
      if (error.code === 11000) {
        throw new Error('Email already exists');
      }
      console.error('❌ Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  /**
   * Delete user (soft delete by setting isActive to false)
   * @param {String} userId - User ID
   * @returns {Object} Deleted user info
   */
  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      ).select('-password');

      if (!user) {
        throw new Error('User not found');
      }

      return { message: 'User deleted successfully', user: user.toJSON() };
    } catch (error) {
      if (error.message === 'User not found') {
        throw error;
      }
      console.error('❌ Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  /**
   * Create admin user
   * @param {Object} adminData - Admin data (name, email, password)
   * @returns {Object} Admin user and token
   */
  async createAdmin(adminData) {
    try {
      const { name, email, password } = adminData;

      // Check if admin already exists
      const existingAdmin = await User.findOne({ email });
      if (existingAdmin) {
        throw new Error('Admin with this email already exists');
      }

      // Create new admin user
      const admin = await User.create({
        name,
        email,
        password,
        role: 'admin',
        isActive: true
      });

      // Generate token
      const generateToken = require('../utils/generateToken');
      const token = generateToken(admin);

      return {
        user: admin.toJSON(),
        token
      };
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw error;
      }
      if (error.code === 11000) {
        throw new Error('Admin with this email already exists');
      }
      console.error('❌ Error creating admin:', error);
      throw new Error('Failed to create admin');
    }
  }
}

module.exports = new AdminService();
