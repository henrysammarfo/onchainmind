const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Chat with AI Twin
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { message, aiTwinId, userId } = req.body;
    
    // This would typically call the AI service
    // For now, return a mock response
    const aiResponse = `Hello! I'm your AI Twin. I understand you said: "${message}". As your AI companion, I'm here to help you navigate the blockchain world and grow your reputation!`;
    
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Get chat history
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // This would typically query the database
    // For now, return mock data
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
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

module.exports = router;
