const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/notifications - customer notifications
router.get('/', requireAuth, (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY id DESC 
      LIMIT 50
    `);
    const notifications = stmt.all(req.user.id);

    const unreadStmt = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0');
    const unread = unreadStmt.get(req.user.id);

    return res.json({
      notifications,
      unread_count: unread ? unread.count : 0
    });
  } catch (err) {
    console.error('Fetch notifications error:', err);
    return res.status(500).json({ error: 'Failed to retrieve notifications.' });
  }
});

// PUT /api/notifications/:id/read - mark single as read
router.put('/:id/read', requireAuth, (req, res) => {
  try {
    const stmt = db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?');
    stmt.run(req.params.id, req.user.id);
    return res.json({ message: 'Notification marked as read.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update notification.' });
  }
});

// PUT /api/notifications/read-all - mark all as read
router.put('/read-all', requireAuth, (req, res) => {
  try {
    const stmt = db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?');
    stmt.run(req.user.id);
    return res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update notifications.' });
  }
});

module.exports = router;

