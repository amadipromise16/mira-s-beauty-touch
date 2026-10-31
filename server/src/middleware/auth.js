const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'miras_beauty_touch_secret_key_default';

function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const stmt = db.prepare('SELECT id, full_name, email, phone, role FROM users WHERE id = ?');
    const user = stmt.get(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User account not found or has been deactivated.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired authentication session.' });
  }
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
    }
    next();
  });
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const stmt = db.prepare('SELECT id, full_name, email, phone, role FROM users WHERE id = ?');
    const user = stmt.get(decoded.id);
    req.user = user || null;
  } catch (err) {
    req.user = null;
  }
  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
  optionalAuth,
  JWT_SECRET,
};

