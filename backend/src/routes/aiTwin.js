const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Get AI Twin data
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // This would typically query the blockchain or database
    // For now, return mock data
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
  } catch (error) {
    console.error('Error fetching AI Twin:', error);
    res.status(500).json({ error: 'Failed to fetch AI Twin data' });
  }
});

// Create/Mint AI Twin
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, personality, traits, skills } = req.body;
    const userId = req.user.id;
    
    // This would typically call the smart contract
    // For now, return success response
    const aiTwin = {
      id: Date.now().toString(),
      name,
      personality,
      traits: [...traits, ...skills].filter(Boolean),
      reputation: 100,
      createdAt: new Date().toISOString(),
      lastInteraction: new Date().toISOString(),
      activityScores: [100]
    };
    
    res.status(201).json(aiTwin);
  } catch (error) {
    console.error('Error creating AI Twin:', error);
    res.status(500).json({ error: 'Failed to create AI Twin' });
  }
});

// Update AI Twin
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // This would typically update the blockchain or database
    // For now, return success response
    res.json({ message: 'AI Twin updated successfully', id });
  } catch (error) {
    console.error('Error updating AI Twin:', error);
    res.status(500).json({ error: 'Failed to update AI Twin' });
  }
});

module.exports = router;
