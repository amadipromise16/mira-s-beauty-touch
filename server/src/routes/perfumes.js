const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/perfumes - public
router.get('/', (req, res) => {
  try {
    const { brand, search, sort, featured } = req.query;
    let query = 'SELECT * FROM perfumes WHERE is_active = 1';
    const params = [];

    if (featured === 'true' || featured === '1') {
      query += ' AND is_featured = 1';
    }

    if (brand && brand !== 'All') {
      query += ' AND brand = ?';
      params.push(brand);
    }

    if (search) {
      query += ' AND (name LIKE ? OR brand LIKE ? OR description LIKE ? OR fragrance_notes LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (sort === 'price_asc') {
      query += ' ORDER BY price_ngn ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY price_ngn DESC';
    } else if (sort === 'name') {
      query += ' ORDER BY name ASC';
    } else {
      query += ' ORDER BY is_featured DESC, id DESC';
    }

    const stmt = db.prepare(query);
    const perfumes = stmt.all(...params);

    return res.json({ perfumes });
  } catch (err) {
    console.error('Fetch perfumes error:', err);
    return res.status(500).json({ error: 'Failed to retrieve perfumes.' });
  }
});

// GET /api/perfumes/brands
router.get('/brands', (req, res) => {
  try {
    const stmt = db.prepare('SELECT DISTINCT brand FROM perfumes WHERE is_active = 1 ORDER BY brand ASC');
    const brands = stmt.all().map(r => r.brand);
    return res.json({ brands: ['All', ...brands] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve brands.' });
  }
});

// GET /api/perfumes/:id
router.get('/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM perfumes WHERE id = ?');
    const perfume = stmt.get(req.params.id);
    if (!perfume) {
      return res.status(404).json({ error: 'Perfume product not found.' });
    }
    return res.json({ perfume });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve perfume.' });
  }
});

// POST /api/perfumes (Admin)
router.post('/', requireAdmin, (req, res) => {
  try {
    const { name, brand, description, fragrance_notes, size, price_ngn, stock_quantity, image_url, is_featured } = req.body;

    if (!name || !brand || price_ngn === undefined) {
      return res.status(400).json({ error: 'Product name, brand, and Nigerian Naira price are required.' });
    }

    const stmt = db.prepare(`
      INSERT INTO perfumes (name, brand, description, fragrance_notes, size, price_ngn, stock_quantity, image_url, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name.trim(),
      brand.trim(),
      description || null,
      fragrance_notes || null,
      size || '100ml EDP',
      Number(price_ngn),
      stock_quantity !== undefined ? Number(stock_quantity) : 10,
      image_url || null,
      is_featured ? 1 : 0
    );

    const newProduct = db.prepare('SELECT * FROM perfumes WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ message: 'Perfume product added successfully.', perfume: newProduct });
  } catch (err) {
    console.error('Create perfume error:', err);
    return res.status(500).json({ error: 'Failed to add perfume.' });
  }
});

// PUT /api/perfumes/:id (Admin)
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const { name, brand, description, fragrance_notes, size, price_ngn, stock_quantity, image_url, is_featured, is_active } = req.body;
    const stmt = db.prepare(`
      UPDATE perfumes
      SET name = COALESCE(?, name),
          brand = COALESCE(?, brand),
          description = COALESCE(?, description),
          fragrance_notes = COALESCE(?, fragrance_notes),
          size = COALESCE(?, size),
          price_ngn = COALESCE(?, price_ngn),
          stock_quantity = COALESCE(?, stock_quantity),
          image_url = COALESCE(?, image_url),
          is_featured = COALESCE(?, is_featured),
          is_active = COALESCE(?, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      name ? name.trim() : null,
      brand ? brand.trim() : null,
      description !== undefined ? description : null,
      fragrance_notes !== undefined ? fragrance_notes : null,
      size !== undefined ? size : null,
      price_ngn !== undefined ? Number(price_ngn) : null,
      stock_quantity !== undefined ? Number(stock_quantity) : null,
      image_url !== undefined ? image_url : null,
      is_featured !== undefined ? (is_featured ? 1 : 0) : null,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM perfumes WHERE id = ?').get(req.params.id);
    return res.json({ message: 'Perfume updated successfully.', perfume: updated });
  } catch (err) {
    console.error('Update perfume error:', err);
    return res.status(500).json({ error: 'Failed to update perfume.' });
  }
});

// DELETE /api/perfumes/:id (Admin)
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM perfumes WHERE id = ?');
    stmt.run(req.params.id);
    return res.json({ message: 'Perfume deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete perfume.' });
  }
});

module.exports = router;

