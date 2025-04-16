// cart-service/src/models/cart.model.js

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  image: {
    type: String,
    required: true
  },
  attributes: {
    type: Map,
    of: String
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    sparse: true,
    index: true
  },
  sessionId: {
    type: String,
    sparse: true,
    index: true
  },
  items: [cartItemSchema],
  discountCode: {
    type: String,
    default: null
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7 * 24 * 60 * 60 // Expire anonymous carts after 7 days
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Ensure that either userId or sessionId is provided
cartSchema.pre('save', function(next) {
  if (!this.userId && !this.sessionId) {
    return next(new Error('Either userId or sessionId must be provided'));
  }
  next();
});

// Calculate totals
cartSchema.methods.calculateTotals = function() {
  let subtotal = 0;
  
  this.items.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  const total = subtotal - this.discountAmount;
  
  return {
    subtotal,
    discount: this.discountAmount,
    total: total > 0 ? total : 0
  };
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;