// product-service/src/models/product.model.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minlength: 5 // At least 5 lines as required
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  images: {
    type: [String],
    required: true,
    validate: [array => array.length >= 3, 'At least 3 images are required']
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: [String],
  isNewProduct: {
    type: Boolean,
    default: true
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  avgRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
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

// Create indexes for searching and filtering
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ isNewProduct: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;