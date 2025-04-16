// review-service/index.js (continued)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Import routes
const reviewRoutes = require('./src/routes/review.routes');

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

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

// Make io accessible to our routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/reviews', reviewRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('join-product', (productId) => {
    socket.join(`product:${productId}`);
    console.log(`Socket ${socket.id} joined room product:${productId}`);
  });
  
  socket.on('leave-product', (productId) => {
    socket.leave(`product:${productId}`);
    console.log(`Socket ${socket.id} left room product:${productId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
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
const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Review service running on port ${PORT}`);
});

module.exports = app;