const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '15m';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';

// Generate access token
const generateAccessToken = (userId) => {
  return jwt.sign(
    { user_id: userId, token_type: 'access' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { user_id: userId, token_type: 'refresh' },
    JWT_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRE }
  );
};

// Generate both tokens
const generateTokens = (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  
  return {
    access: accessToken,
    refresh: refreshToken
  };
};

// Verify token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Verify refresh token and generate new access token
const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = verifyToken(refreshToken);
    
    if (decoded.token_type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    // Check if user exists and refresh token matches
    const user = await User.findById(decoded.user_id);
    if (!user || user.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);
    
    return {
      access: newAccessToken
    };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Blacklist token (save to user's refreshToken field as null)
const blacklistToken = async (userId, refreshToken) => {
  try {
    const user = await User.findById(userId);
    if (user && user.refreshToken === refreshToken) {
      user.refreshToken = null;
      await user.save();
      return true;
    }
    return false;
  } catch (error) {
    throw new Error('Error blacklisting token');
  }
};

// Save refresh token to user
const saveRefreshToken = async (userId, refreshToken) => {
  try {
    await User.findByIdAndUpdate(userId, { refreshToken });
  } catch (error) {
    throw new Error('Error saving refresh token');
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyToken,
  refreshAccessToken,
  blacklistToken,
  saveRefreshToken
}; 