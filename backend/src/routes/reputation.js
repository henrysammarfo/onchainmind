const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Get user reputation
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // This would typically query the blockchain or database
    // For now, return mock data
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
  } catch (error) {
    console.error('Error fetching reputation:', error);
    res.status(500).json({ error: 'Failed to fetch reputation data' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    // This would typically query the blockchain or database
    // For now, return mock data
    const leaderboard = [
      { address: '0x1234...5678', score: 1500, level: 5, name: 'CryptoMaster' },
      { address: '0x2345...6789', score: 1200, level: 4, name: 'BlockchainPro' },
      { address: '0x3456...7890', score: 1000, level: 3, name: 'DeFiExplorer' }
    ];
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Award reputation
router.post('/award', authenticateToken, async (req, res) => {
  try {
    const { userId, amount, reason } = req.body;
    
    // This would typically call the smart contract
    // For now, return success response
    res.json({ message: 'Reputation awarded successfully', amount, reason });
  } catch (error) {
    console.error('Error awarding reputation:', error);
    res.status(500).json({ error: 'Failed to award reputation' });
  }
});

module.exports = router;
