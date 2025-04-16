// user-service/src/models/user.model.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() { return !this.socialLogin; }
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  socialLogin: {
    type: Boolean,
    default: false
  },
  socialProvider: {
    type: String,
    enum: ['google', 'facebook', null],
    default: null
  },
  socialId: String,
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  defaultAddressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;