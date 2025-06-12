const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateTokens, saveRefreshToken, blacklistToken, refreshAccessToken } = require('../utils/jwt');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('fullName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters')
    .trim(),
  body('phoneNumber')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
  body('username')
    .notEmpty()
    .withMessage('Username or email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Register user
router.post('/register', registerValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, email, fullName, phoneNumber, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username },
        { email },
        { phoneNumber }
      ]
    });

    if (existingUser) {
      let field = 'Username';
      if (existingUser.email === email) field = 'Email';
      else if (existingUser.phoneNumber === phoneNumber) field = 'Phone number';
      
      return res.status(400).json({
        message: `${field} already exists`
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      fullName,
      phoneNumber,
      password
    });

    await user.save();

    // Generate tokens
    const tokens = generateTokens(user._id);
    await saveRefreshToken(user._id, tokens.refresh);

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toSafeObject(),
      tokens
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Login user
router.post('/login', loginValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findByUsernameOrEmail(username);
    
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        message: 'Account is deactivated'
      });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = generateTokens(user._id);
    await saveRefreshToken(user._id, tokens.refresh);

    res.json({
      message: 'Login successful',
      user: user.toSafeObject(),
      tokens
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        message: 'Refresh token is required'
      });
    }

    const tokens = await refreshAccessToken(refresh_token);

    res.json({
      message: 'Token refreshed successfully',
      tokens
    });
  } catch (error) {
    res.status(401).json({
      message: 'Invalid refresh token',
      error: error.message
    });
  }
});

// Logout user
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        message: 'Refresh token is required'
      });
    }

    // Blacklist the refresh token
    await blacklistToken(req.user._id, refresh_token);

    res.status(205).json({
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(400).json({
      message: 'Logout failed',
      error: error.message
    });
  }
});

// Get all users (staff only)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isStaff) {
      return res.status(403).json({
        message: 'Staff access required'
      });
    }

    const users = await User.find({ isActive: true })
      .select('-password -refreshToken')
      .sort({ dateJoined: -1 });

    res.json({
      users: users.map(user => user.toSafeObject())
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    user: req.user.toSafeObject()
  });
});

// Update user profile
router.put('/me', authenticateToken, [
  body('fullName').optional().isLength({ min: 2, max: 50 }).trim(),
  body('phoneNumber').optional().isMobilePhone(),
  body('areasOfInterest').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { fullName, phoneNumber, areasOfInterest } = req.body;
    const user = await User.findById(req.user._id);

    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (areasOfInterest) user.areasOfInterest = areasOfInterest;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.toSafeObject()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

module.exports = router; 