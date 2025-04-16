// order-service/src/models/order.model.js

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
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
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  attributes: {
    type: Map,
    of: String
  },
  image: String
});

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: String
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'Vietnam' }
  },
  subtotal: {
    type: Number,
    required: true
  },
  discountCode: String,
  discountAmount: {
    type: Number,
    default: 0
  },
  shippingFee: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'bank_transfer', 'cash_on_delivery']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [statusHistorySchema],
  loyaltyPointsEarned: {
    type: Number,
    default: 0
  },
  loyaltyPointsUsed: {
    type: Number,
    default: 0
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    const lastOrder = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
    let sequence = '0001';
    
    if (lastOrder && lastOrder.orderNumber) {
      const lastSequence = lastOrder.orderNumber.substr(-4);
      const nextSequence = (parseInt(lastSequence, 10) + 1).toString();
      sequence = nextSequence.padStart(4, '0');
    }
    
    this.orderNumber = `ORD-${year}${month}${day}-${sequence}`;
    
    // Add the initial status to history
    if (this.status && this.statusHistory.length === 0) {
      this.statusHistory.push({
        status: this.status,
        timestamp: new Date(),
        note: 'Order created'
      });
    }
    
    // Calculate loyalty points (10% of total)
    this.loyaltyPointsEarned = Math.floor(this.total * 0.1);
  }
  
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;