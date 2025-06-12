const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 15
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isStaff: {
    type: Boolean,
    default: false
  },
  areasOfInterest: [{
    type: String,
    trim: true
  }],
  refreshToken: {
    type: String,
    default: null
  }
}, {
  timestamps: { 
    createdAt: 'dateJoined', 
    updatedAt: 'lastLogin' 
  }
});

// Index for better query performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate user object without sensitive data
userSchema.methods.toSafeObject = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.refreshToken;
  return userObject;
};

// Static method to find by username or email
userSchema.statics.findByUsernameOrEmail = function(identifier) {
  return this.findOne({
    $or: [
      { username: identifier },
      { email: identifier }
    ]
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User; 