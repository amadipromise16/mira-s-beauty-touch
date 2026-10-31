const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Helper to generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'Please provide full name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check existing
    const checkStmt = db.prepare('SELECT id FROM users WHERE email = ?');
    const existing = checkStmt.get(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    const insertStmt = db.prepare(`
      INSERT INTO users (full_name, email, phone, password_hash, role)
      VALUES (?, ?, ?, ?, 'client')
    `);
    const result = insertStmt.run(full_name.trim(), cleanEmail, phone ? phone.trim() : null, password_hash);

    const newUser = {
      id: Number(result.lastInsertRowid),
      full_name: full_name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : null,
      role: 'client'
    };

    // Welcome notification
    const notifStmt = db.prepare(`
      INSERT INTO notifications (user_id, type, title, message)
      VALUES (?, 'system', 'Welcome to Mira’s Beauty Touch!', 'Thank you for joining us. Book your beauty appointments or explore our exquisite perfume collection today.')
    `);
    notifStmt.run(newUser.id);

    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(cleanEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email address or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email address or password.' });
    }

    const safeUser = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    const token = generateToken(safeUser);

    return res.json({
      message: 'Logged in successfully.',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  try {
    const unreadStmt = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0');
    const unread = unreadStmt.get(req.user.id);

    return res.json({
      user: req.user,
      unread_notifications: unread ? unread.count : 0
    });
  } catch (err) {
    console.error('Me endpoint error:', err);
    return res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Please provide your registered email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const userStmt = db.prepare('SELECT id, full_name, email FROM users WHERE email = ?');
    const user = userStmt.get(cleanEmail);

    if (!user) {
      // Security: do not leak whether email exists
      return res.json({
        message: 'If an account exists with this email address, password reset instructions have been generated.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString(); // 1 hour

    const insertToken = db.prepare(`
      INSERT INTO password_resets (user_id, token, expires_at)
      VALUES (?, ?, ?)
    `);
    insertToken.run(user.id, resetToken, expiresAt);

    // In production this sends an email. We provide the token in response during dev/testing for user convenience
    return res.json({
      message: 'Password reset link generated. Follow the link to choose a new password.',
      reset_token: resetToken,
      reset_link: `/reset-password?token=${resetToken}`
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Unable to process password reset request.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', (req, res) => {
  try {
    const { token, new_password } = req.body;

    if (!token || !new_password) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    const tokenStmt = db.prepare(`
      SELECT * FROM password_resets 
      WHERE token = ? AND is_used = 0 AND expires_at > CURRENT_TIMESTAMP
    `);
    const record = tokenStmt.get(token);

    if (!record) {
      return res.status(400).json({ error: 'Invalid or expired password reset token.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(new_password, salt);

    const updatePwd = db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    updatePwd.run(password_hash, record.user_id);

    const markUsed = db.prepare('UPDATE password_resets SET is_used = 1 WHERE id = ?');
    markUsed.run(record.id);

    return res.json({ message: 'Password reset successfully. You may now log in with your new password.' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// PUT /api/auth/profile
router.put('/profile', requireAuth, (req, res) => {
  try {
    const { full_name, phone } = req.body;
    if (!full_name) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    const updateStmt = db.prepare(`
      UPDATE users 
      SET full_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    updateStmt.run(full_name.trim(), phone ? phone.trim() : null, req.user.id);

    const userStmt = db.prepare('SELECT id, full_name, email, phone, role FROM users WHERE id = ?');
    const updatedUser = userStmt.get(req.user.id);

    return res.json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

module.exports = router;

