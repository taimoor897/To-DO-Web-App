const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // ✅ use req.user.id everywhere
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;

