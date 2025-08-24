const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For demo purposes, allow requests without tokens
    // In production, this should require proper authentication
    req.user = { id: req.headers['x-user-id'] || 'demo-user' };
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET || 'demo-secret', (err, user) => {
    if (err) {
      // For demo purposes, allow requests with invalid tokens
      // In production, this should return 403 Forbidden
      req.user = { id: req.headers['x-user-id'] || 'demo-user' };
      return next();
    }
    
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken
};
