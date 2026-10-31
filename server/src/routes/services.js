const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/services - public
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM services WHERE is_active = 1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY id ASC';
    const stmt = db.prepare(query);
    const services = stmt.all(...params);

    return res.json({ services });
  } catch (err) {
    console.error('Fetch services error:', err);
    return res.status(500).json({ error: 'Failed to retrieve services.' });
  }
});

// GET /api/services/categories
router.get('/categories', (req, res) => {
  try {
    const stmt = db.prepare('SELECT DISTINCT category FROM services WHERE is_active = 1 ORDER BY category ASC');
    const categories = stmt.all().map(r => r.category);
    return res.json({ categories: ['All', ...categories] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve categories.' });
  }
});

// GET /api/services/:id
router.get('/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM services WHERE id = ?');
    const service = stmt.get(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found.' });
    }
    return res.json({ service });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve service.' });
  }
});

// POST /api/services (Admin)
router.post('/', requireAdmin, (req, res) => {
  try {
    const { name, category, description, price_ngn, duration_mins, image_url } = req.body;

    if (!name || !category || price_ngn === undefined) {
      return res.status(400).json({ error: 'Name, category, and price in Naira are required.' });
    }

    const insert = db.prepare(`
      INSERT INTO services (name, category, description, price_ngn, duration_mins, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = insert.run(
      name.trim(),
      category.trim(),
      description || null,
      Number(price_ngn),
      duration_mins ? Number(duration_mins) : 60,
      image_url || null
    );

    const getNew = db.prepare('SELECT * FROM services WHERE id = ?');
    const newService = getNew.get(result.lastInsertRowid);

    return res.status(201).json({ message: 'Service created successfully.', service: newService });
  } catch (err) {
    console.error('Create service error:', err);
    return res.status(500).json({ error: 'Failed to create service.' });
  }
});

// PUT /api/services/:id (Admin)
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const { name, category, description, price_ngn, duration_mins, image_url, is_active } = req.body;
    const stmt = db.prepare(`
      UPDATE services 
      SET name = COALESCE(?, name),
          category = COALESCE(?, category),
          description = COALESCE(?, description),
          price_ngn = COALESCE(?, price_ngn),
          duration_mins = COALESCE(?, duration_mins),
          image_url = COALESCE(?, image_url),
          is_active = COALESCE(?, is_active)
      WHERE id = ?
    `);

    stmt.run(
      name ? name.trim() : null,
      category ? category.trim() : null,
      description !== undefined ? description : null,
      price_ngn !== undefined ? Number(price_ngn) : null,
      duration_mins !== undefined ? Number(duration_mins) : null,
      image_url !== undefined ? image_url : null,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    return res.json({ message: 'Service updated successfully.', service: updated });
  } catch (err) {
    console.error('Update service error:', err);
    return res.status(500).json({ error: 'Failed to update service.' });
  }
});

// DELETE /api/services/:id (Admin)
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM services WHERE id = ?');
    stmt.run(req.params.id);
    return res.json({ message: 'Service deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete service.' });
  }
});

module.exports = router;

