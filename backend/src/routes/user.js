const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Get user profile
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // This would typically query the database
    // For now, return mock data
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
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    // This would typically update the database
    // For now, return success response
    res.json({ message: 'User profile updated successfully', userId });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

module.exports = router;
