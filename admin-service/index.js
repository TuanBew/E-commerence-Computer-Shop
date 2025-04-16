// admin-service/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

// Import routes
const dashboardRoutes = require('./src/routes/dashboard.routes');
const adminProductRoutes = require('./src/routes/product.routes');
const adminUserRoutes = require('./src/routes/user.routes');
const adminOrderRoutes = require('./src/routes/order.routes');
const adminDiscountRoutes = require('./src/routes/discount.routes');

// Initialize express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin middleware - verify admin role
const verifyAdmin = require('./src/middleware/admin.middleware');
app.use('/api/admin', verifyAdmin);

// Routes
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/discounts', adminDiscountRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Admin service running on port ${PORT}`);
});

module.exports = app;