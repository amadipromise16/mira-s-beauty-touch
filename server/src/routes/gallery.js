const express = require('express');
const db = require('../db');
const { requireAuth, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/gallery - public with optional auth to check if user liked
router.get('/', optionalAuth, (req, res) => {
  try {
    const { category, type } = req.query;
    let query = `
      SELECT 
        g.*,
        COUNT(l.id) AS like_count,
        CASE 
          WHEN ? IS NOT NULL AND EXISTS(
            SELECT 1 FROM gallery_likes ul 
            WHERE ul.gallery_item_id = g.id AND ul.user_id = ?
          ) THEN 1 
          ELSE 0 
        END AS user_has_liked
      FROM gallery_items g
      LEFT JOIN gallery_likes l ON g.id = l.gallery_item_id
      WHERE g.is_published = 1
    `;

    const userId = req.user ? req.user.id : null;
    const params = [userId, userId];

    if (category && category !== 'All') {
      query += ' AND g.category = ?';
      params.push(category);
    }

    if (type && type !== 'All') {
      query += ' AND g.media_type = ?';
      params.push(type);
    }

    query += ' GROUP BY g.id ORDER BY g.display_order ASC, g.id ASC';

    const stmt = db.prepare(query);
    const items = stmt.all(...params);

    const formatted = items.map(item => ({
      ...item,
      like_count: Number(item.like_count) || 0,
      user_has_liked: Boolean(item.user_has_liked)
    }));

    return res.json({ gallery: formatted });
  } catch (err) {
    console.error('Fetch gallery error:', err);
    return res.status(500).json({ error: 'Failed to retrieve gallery items.' });
  }
});

// POST /api/gallery/:id/like - MANDATORY: Requires auth & 1 like per user constraint
router.post('/:id/like', requireAuth, (req, res) => {
  try {
    const itemId = Number(req.params.id);
    const userId = req.user.id;

    // Check if gallery item exists
    const checkItem = db.prepare('SELECT id FROM gallery_items WHERE id = ?');
    const item = checkItem.get(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Gallery item not found.' });
    }

    // Check if user already liked
    const checkLike = db.prepare('SELECT id FROM gallery_likes WHERE user_id = ? AND gallery_item_id = ?');
    const existing = checkLike.get(userId, itemId);

    let user_has_liked = false;

    if (existing) {
      // User clicked like again -> Unlike
      const removeLike = db.prepare('DELETE FROM gallery_likes WHERE user_id = ? AND gallery_item_id = ?');
      removeLike.run(userId, itemId);
      user_has_liked = false;
    } else {
      // User liked -> Insert with unique protection
      try {
        const insertLike = db.prepare('INSERT INTO gallery_likes (user_id, gallery_item_id) VALUES (?, ?)');
        insertLike.run(userId, itemId);
        user_has_liked = true;
      } catch (insertErr) {
        // Unique constraint triggered
        user_has_liked = true;
      }
    }

    // Calculate authoritative new like count
    const countStmt = db.prepare('SELECT COUNT(*) as count FROM gallery_likes WHERE gallery_item_id = ?');
    const countRes = countStmt.get(itemId);
    const like_count = Number(countRes ? countRes.count : 0);

    return res.json({
      message: user_has_liked ? 'Liked successfully.' : 'Like removed.',
      liked: user_has_liked,
      like_count
    });
  } catch (err) {
    console.error('Gallery like error:', err);
    return res.status(500).json({ error: 'Failed to update like status.' });
  }
});

// POST /api/gallery (Admin create item)
router.post('/', requireAdmin, (req, res) => {
  try {
    const { title, category, media_type, media_url, description } = req.body;

    if (!title || !media_url) {
      return res.status(400).json({ error: 'Title and media URL are required.' });
    }

    const stmt = db.prepare(`
      INSERT INTO gallery_items (title, category, media_type, media_url, description)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title.trim(),
      category ? category.trim() : 'Salon Artistry',
      media_type === 'video' ? 'video' : 'image',
      media_url.trim(),
      description || null
    );

    const newItem = db.prepare('SELECT * FROM gallery_items WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({
      message: 'Gallery item added successfully.',
      item: { ...newItem, like_count: 0, user_has_liked: false }
    });
  } catch (err) {
    console.error('Create gallery item error:', err);
    return res.status(500).json({ error: 'Failed to add gallery item.' });
  }
});

// DELETE /api/gallery/:id (Admin delete item - cascades likes)
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM gallery_items WHERE id = ?');
    stmt.run(req.params.id);
    return res.json({ message: 'Gallery item and associated likes removed successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete gallery item.' });
  }
});

module.exports = router;

