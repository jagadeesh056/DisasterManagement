const { mockUsers } = require('../config/config');

const authenticate = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  next();
};

module.exports = { authenticate };

