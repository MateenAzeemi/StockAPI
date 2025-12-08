const User = require('../models/User.model');
const generateToken = require('../utils/generateToken');

/**
 * Auth Service
 * Business logic for authentication
 */
class AuthService {
  /**
   * Sign up a new user
   * @param {Object} userData - User data (name, email, password)
   * @returns {Object} User and token
   */
  async signup(userData) {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user with role = "user"
    const user = await User.create({
      name,
      email,
      password,
      role: 'user'
    });

    // Generate token
    const token = generateToken(user);

    return {
      user: user.toJSON(),
      token
    };
  }

  /**
   * Login user
   * @param {Object} credentials - Login credentials (email, password)
   * @returns {Object} User and token
   */
  async login(credentials) {
    const { email, password } = credentials;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Check if user has role = "user" (reject admin users)
    if (user.role !== 'user') {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user);

    return {
      user: user.toJSON(),
      token
    };
  }

  /**
   * Login admin
   * @param {Object} credentials - Login credentials (email, password)
   * @returns {Object} Admin and token
   */
  async adminLogin(credentials) {
    const { email, password } = credentials;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      throw new Error('Access denied: Admin privileges required');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user);

    return {
      user: user.toJSON(),
      token
    };
  }

  /**
   * Get current user
   * @param {String} userId - User ID
   * @returns {Object} User
   */
  async getMe(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return user.toJSON();
  }
}

module.exports = new AuthService();

