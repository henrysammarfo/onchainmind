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
    environment: process.env.NODE_ENV || 'development',
    message: 'OnchainMind Backend is running!'
  });
});

// Simple API routes
app.get('/api/status', (req, res) => {
  res.json({
    message: 'OnchainMind Backend API is working!',
    timestamp: new Date().toISOString(),
    contracts: {
      ReputationScore: '0x4Cb95F24330B5081e11c354Dcf4901D096131f4A',
      AIIdentity: '0x3D177eC72cFc2E95F55aCa056dF5820A1c50865C',
      AIRegistry: '0x7EAF008952aB45009b129F83735622bE3Ab19494'
    }
  });
});

// Mock AI Twin endpoint
app.get('/api/ai-twin/:userId', (req, res) => {
  const { userId } = req.params;
  const aiTwin = {
    id: '1',
    name: 'Demo AI Twin',
    personality: 'A helpful and knowledgeable AI companion',
    traits: ['Intelligent', 'Helpful', 'Blockchain-savvy'],
    reputation: 100,
    createdAt: new Date().toISOString(),
    lastInteraction: new Date().toISOString(),
    activityScores: [100, 95, 88, 92, 97]
  };
  res.json(aiTwin);
});

// Mock create AI Twin endpoint
app.post('/api/ai-twin', (req, res) => {
  const { name, personality, traits, skills } = req.body;
  const aiTwin = {
    id: Date.now().toString(),
    name,
    personality,
    traits: [...(traits || []), ...(skills || [])].filter(Boolean),
    reputation: 100,
    createdAt: new Date().toISOString(),
    lastInteraction: new Date().toISOString(),
    activityScores: [100]
  };
  res.status(201).json(aiTwin);
});

// Mock reputation endpoint
app.get('/api/reputation/:userId', (req, res) => {
  const { userId } = req.params;
  const reputation = {
    score: 100,
    level: 1,
    totalEarned: 100,
    totalSpent: 0,
    lastUpdated: new Date().toISOString(),
    achievements: ['First Steps'],
    transactionHistory: [100]
  };
  res.json(reputation);
});

// Mock leaderboard endpoint
app.get('/api/leaderboard', (req, res) => {
  const leaderboard = [
    { address: '0x1234...5678', score: 1500, level: 5, name: 'CryptoMaster' },
    { address: '0x2345...6789', score: 1200, level: 4, name: 'BlockchainPro' },
    { address: '0x3456...7890', score: 1000, level: 3, name: 'DeFiExplorer' }
  ];
  res.json(leaderboard);
});

// Mock chat history endpoint
app.get('/api/chat/:userId', (req, res) => {
  const chatHistory = [
    {
      id: '1',
      message: 'Hello, how can I help you today?',
      response: 'I\'m here to help you with blockchain questions!',
      timestamp: new Date().toISOString(),
      aiTwinId: '1'
    }
  ];
  res.json(chatHistory);
});

// Mock user profile endpoint
app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userProfile = {
    id: userId,
    address: userId,
    username: 'DemoUser',
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    preferences: {
      theme: 'dark',
      notifications: true
    }
  };
  res.json(userProfile);
});

// Mock chat endpoint
app.post('/api/chat', (req, res) => {
  const { message, aiTwinId, userId } = req.body;
  
  const responses = [
    `Hello! I'm your AI Twin. I understand you said: "${message}". As your AI companion, I'm here to help you navigate the blockchain world and grow your reputation!`,
    `That's an interesting question about "${message}". Based on my analysis of blockchain trends, I can help you understand this better.`,
    `I see you're asking about "${message}". As your AI Twin, I've been learning from your interactions. This relates to some patterns I've noticed.`,
    `Great question! Regarding "${message}", I think this is a perfect opportunity to discuss how this impacts your onchain reputation.`
  ];
  
  const aiResponse = responses[Math.floor(Math.random() * responses.length)];
  res.json({ response: aiResponse });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('🔌 New WebSocket connection:', socket.id);

  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  });

  socket.on('chat-message', async (data) => {
    try {
      const { userId, message, aiTwinId } = data;
      
      // Mock AI response
      const aiResponse = `Hello! I'm your AI Twin. I understand you said: "${message}". As your AI companion, I'm here to help you navigate the blockchain world and grow your reputation!`;
      
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

  socket.on('disconnect', () => {
    console.log('🔌 WebSocket disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`🚀 OnchainMind Backend Server running on ${HOST}:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔌 WebSocket enabled: true`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});

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

module.exports = { app, server, io };
