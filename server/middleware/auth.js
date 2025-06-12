const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        message: 'Access token required' 
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    if (decoded.token_type !== 'access') {
      return res.status(401).json({ 
        message: 'Invalid token type' 
      });
    }

    // Get user from database
    const user = await User.findById(decoded.user_id).select('-password -refreshToken');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'User account is deactivated' 
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      message: 'Invalid token',
      error: error.message 
    });
  }
};

// Middleware to check if user is staff
const requireStaff = (req, res, next) => {
  if (!req.user || !req.user.isStaff) {
    return res.status(403).json({ 
      message: 'Staff access required' 
    });
  }
  next();
};

// Middleware to check if user is active
const requireActive = (req, res, next) => {
  if (!req.user || !req.user.isActive) {
    return res.status(403).json({ 
      message: 'Active account required' 
    });
  }
  next();
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      
      if (decoded.token_type === 'access') {
        const user = await User.findById(decoded.user_id).select('-password -refreshToken');
        if (user && user.isActive) {
          req.user = user;
        }
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticateToken,
  requireStaff,
  requireActive,
  optionalAuth
}; 