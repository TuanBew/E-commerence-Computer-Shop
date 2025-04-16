// order-service/src/models/discount.model.js

const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    minlength: 5,
    maxlength: 5
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  maxUsage: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  usageCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  appliedOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
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

// Validation to ensure code is 5-character alphanumeric
discountSchema.path('code').validate(function(value) {
  return /^[A-Z0-9]{5}$/.test(value);
}, 'Discount code must be a 5-character alphanumeric string');

// Check if discount is still valid
discountSchema.methods.isValid = function() {
  return this.isActive && this.usageCount < this.maxUsage;
};

// Calculate discount amount
discountSchema.methods.calculateDiscount = function(orderTotal) {
  if (!this.isValid() || orderTotal < this.minOrderAmount) {
    return 0;
  }
  
  if (this.discountType === 'percentage') {
    return Math.round(orderTotal * (this.discountValue / 100));
  }
  
  return Math.min(this.discountValue, orderTotal);
};

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;