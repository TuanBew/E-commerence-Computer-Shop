// review-service/src/models/review.model.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    sparse: true,
    index: true
  },
  guestName: {
    type: String,
    required: function() { return !this.userId; }
  },
  guestEmail: {
    type: String,
    required: function() { return !this.userId; }
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: function() { return !!this.userId; }
  },
  comment: {
    type: String,
    required: true,
    minlength: 3
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
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

// Validation for guest reviews
reviewSchema.path('comment').validate(function(value) {
  // If it's a guest (no userId), ensure only comment is provided, not rating
  if (!this.userId && this.rating) {
    throw new Error('Guest users can only leave comments, not ratings');
  }
  return true;
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;