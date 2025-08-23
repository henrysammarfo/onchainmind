const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Import routes
const aiTwinRoutes = require('./routes/aiTwin');
const reputationRoutes = require('./routes/reputation');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/user');
const blockchainRoutes = require('./routes/blockchain');

// Import middleware
const { authenticateToken } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');

// Import services
const { initializeBlockchain } = require('./services/blockchain');
const { initializeAI } = require('./services/ai');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/ai-twin', aiTwinRoutes);
app.use('/api/reputation', reputationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);
app.use('/api/blockchain', blockchainRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('🔌 New WebSocket connection:', socket.id);

  // Join user to their personal room
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  });

  // Handle chat messages
  socket.on('chat-message', async (data) => {
    try {
      const { userId, message, aiTwinId } = data;
      
      // Process message with AI
      const aiResponse = await processAIResponse(userId, message, aiTwinId);
      
      // Broadcast response to user's room
      io.to(`user-${userId}`).emit('ai-response', {
        message: aiResponse,
        timestamp: new Date().toISOString(),
        aiTwinId
      });
    } catch (error) {
      console.error('Error processing chat message:', error);
      socket.emit('error', { message: 'Failed to process message' });
    }
  });

  // Handle reputation updates
  socket.on('reputation-update', (data) => {
    const { userId, newReputation, reason } = data;
    io.to(`user-${userId}`).emit('reputation-changed', {
      newReputation,
      reason,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log('🔌 WebSocket disconnected:', socket.id);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Initialize services
async function initializeServices() {
  try {
    console.log('🚀 Initializing OnchainMind Backend Services...');
    
    // Initialize blockchain connection
    await initializeBlockchain();
    console.log('✅ Blockchain service initialized');
    
    // Initialize AI services
    await initializeAI();
    console.log('✅ AI service initialized');
    
    console.log('🎉 All services initialized successfully!');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
    process.exit(1);
  }
}

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
  try {
    await initializeServices();
    
    server.listen(PORT, HOST, () => {
      console.log(`🚀 OnchainMind Backend Server running on ${HOST}:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`🔌 WebSocket enabled: true`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();

module.exports = { app, server, io };
