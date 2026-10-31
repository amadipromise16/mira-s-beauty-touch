const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply requireAdmin to all endpoints in this router
router.use(requireAdmin);

// GET /api/admin/stats - Overview statistics
router.get('/stats', (req, res) => {
  try {
    const clientsCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'client'").get().count;
    const pendingApts = db.prepare("SELECT COUNT(*) as count FROM appointments WHERE status = 'pending'").get().count;
    const approvedApts = db.prepare("SELECT COUNT(*) as count FROM appointments WHERE status = 'approved'").get().count;
    const completedApts = db.prepare("SELECT COUNT(*) as count FROM appointments WHERE status = 'completed'").get().count;
    const today = new Date().toISOString().split('T')[0];
    const upcomingApts = db.prepare("SELECT COUNT(*) as count FROM appointments WHERE status = 'approved' AND requested_date >= ?").get(today).count;
    
    const galleryItems = db.prepare("SELECT COUNT(*) as count FROM gallery_items").get().count;
    const totalLikes = db.prepare("SELECT COUNT(*) as count FROM gallery_likes").get().count;
    const totalPerfumes = db.prepare("SELECT COUNT(*) as count FROM perfumes WHERE is_active = 1").get().count;
    const totalServices = db.prepare("SELECT COUNT(*) as count FROM services WHERE is_active = 1").get().count;

    return res.json({
      stats: {
        total_clients: clientsCount,
        pending_appointments: pendingApts,
        approved_appointments: approvedApts,
        upcoming_appointments: upcomingApts,
        completed_appointments: completedApts,
        gallery_items: galleryItems,
        total_gallery_likes: totalLikes,
        total_perfumes: totalPerfumes,
        total_services: totalServices
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ error: 'Failed to retrieve admin statistics.' });
  }
});

// GET /api/admin/appointments - List appointments with optional filter
router.get('/appointments', (req, res) => {
  try {
    const { status, search } = req.query;
    let query = `
      SELECT a.*, u.email as user_email, u.full_name as user_name
      FROM appointments a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      query += ' AND a.status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (a.booking_ref LIKE ? OR a.customer_name LIKE ? OR a.customer_phone LIKE ? OR a.service_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY a.requested_date DESC, a.id DESC';
    const appointments = db.prepare(query).all(...params);

    return res.json({ appointments });
  } catch (err) {
    console.error('Admin appointments error:', err);
    return res.status(500).json({ error: 'Failed to retrieve appointments.' });
  }
});

// PUT /api/admin/appointments/:id/approve - Approve appointment with notification
router.put('/appointments/:id/approve', (req, res) => {
  try {
    const aptId = req.params.id;
    const { admin_notes, confirmed_date, confirmed_time } = req.body;

    const apt = db.prepare('SELECT * FROM appointments WHERE id = ?').get(aptId);
    if (!apt) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    const dateToConfirm = confirmed_date || apt.requested_date;
    const timeToConfirm = confirmed_time || apt.requested_time;
    const confirmedDateTimeStr = `${dateToConfirm} at ${timeToConfirm}`;

    const updateStmt = db.prepare(`
      UPDATE appointments 
      SET status = 'approved',
          requested_date = ?,
          requested_time = ?,
          confirmed_date_time = ?,
          admin_notes = COALESCE(?, admin_notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    updateStmt.run(dateToConfirm, timeToConfirm, confirmedDateTimeStr, admin_notes || null, aptId);

    // Mandated customer notification:
    // “Your Mira’s Beauty Touch appointment has been approved. Your confirmed appointment is scheduled for [date] at [time].”
    const notifMsg = `Your Mira’s Beauty Touch appointment has been approved. Your confirmed appointment is scheduled for ${dateToConfirm} at ${timeToConfirm}.`;
    const notifStmt = db.prepare(`
      INSERT INTO notifications (user_id, type, title, message, appointment_id)
      VALUES (?, 'appointment_approved', 'Appointment Approved 🎉', ?, ?)
    `);
    notifStmt.run(apt.user_id, notifMsg, apt.id);

    const updatedApt = db.prepare('SELECT * FROM appointments WHERE id = ?').get(aptId);
    return res.json({
      message: 'Appointment approved and customer notified successfully.',
      appointment: updatedApt
    });
  } catch (err) {
    console.error('Approve appointment error:', err);
    return res.status(500).json({ error: 'Failed to approve appointment.' });
  }
});

// PUT /api/admin/appointments/:id/reject - Reject appointment with notification
router.put('/appointments/:id/reject', (req, res) => {
  try {
    const aptId = req.params.id;
    const { admin_notes } = req.body;

    const apt = db.prepare('SELECT * FROM appointments WHERE id = ?').get(aptId);
    if (!apt) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    const updateStmt = db.prepare(`
      UPDATE appointments 
      SET status = 'rejected',
          admin_notes = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    updateStmt.run(admin_notes || 'Declined due to scheduling capacity.', aptId);

    const notifMsg = `Your appointment request for "${apt.service_name}" on ${apt.requested_date} could not be accommodated at this time.${admin_notes ? ` Note: ${admin_notes}` : ' Please feel free to select another time slot or contact us.'}`;
    const notifStmt = db.prepare(`
      INSERT INTO notifications (user_id, type, title, message, appointment_id)
      VALUES (?, 'appointment_rejected', 'Appointment Update', ?, ?)
    `);
    notifStmt.run(apt.user_id, notifMsg, apt.id);

    const updatedApt = db.prepare('SELECT * FROM appointments WHERE id = ?').get(aptId);
    return res.json({
      message: 'Appointment rejected and customer notified.',
      appointment: updatedApt
    });
  } catch (err) {
    console.error('Reject appointment error:', err);
    return res.status(500).json({ error: 'Failed to reject appointment.' });
  }
});

// PUT /api/admin/appointments/:id/reschedule
router.put('/appointments/:id/reschedule', (req, res) => {
  try {
    const aptId = req.params.id;
    const { new_date, new_time, admin_notes } = req.body;

    if (!new_date || !new_time) {
      return res.status(400).json({ error: 'New date and new time are required.' });
    }

    const apt = db.prepare('SELECT * FROM appointments WHERE id = ?').get(aptId);
    if (!apt) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    const confirmedDateTimeStr = `${new_date} at ${new_time}`;

    const updateStmt = db.prepare(`
      UPDATE appointments 
      SET status = 'approved',
          requested_date = ?,
          requested_time = ?,
          confirmed_date_time = ?,
          admin_notes = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    updateStmt.run(new_date, new_time, confirmedDateTimeStr, admin_notes || 'Rescheduled by salon manager', aptId);

    const notifMsg = `Your Mira’s Beauty Touch appointment has been rescheduled. Your confirmed appointment is now scheduled for ${new_date} at ${new_time}.${admin_notes ? ` (${admin_notes})` : ''}`;
    const notifStmt = db.prepare(`
      INSERT INTO notifications (user_id, type, title, message, appointment_id)
      VALUES (?, 'appointment_rescheduled', 'Appointment Rescheduled 📅', ?, ?)
    `);
    notifStmt.run(apt.user_id, notifMsg, apt.id);

    const updatedApt = db.prepare('SELECT * FROM appointments WHERE id = ?').get(aptId);
    return res.json({
      message: 'Appointment rescheduled and customer notified.',
      appointment: updatedApt
    });
  } catch (err) {
    console.error('Reschedule appointment error:', err);
    return res.status(500).json({ error: 'Failed to reschedule appointment.' });
  }
});

// PUT /api/admin/appointments/:id/complete
router.put('/appointments/:id/complete', (req, res) => {
  try {
    const aptId = req.params.id;
    const updateStmt = db.prepare("UPDATE appointments SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = ?");
    updateStmt.run(aptId);
    return res.json({ message: 'Appointment marked as completed.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to mark appointment completed.' });
  }
});

// DELETE /api/admin/appointments/:id
router.delete('/appointments/:id', (req, res) => {
  try {
    const aptId = req.params.id;
    db.prepare('DELETE FROM appointments WHERE id = ?').run(aptId);
    return res.json({ message: 'Appointment deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete appointment.' });
  }
});

// GET /api/admin/users - Customer directory
router.get('/users', (req, res) => {
  try {
    const users = db.prepare(`
      SELECT 
        u.id, u.full_name, u.email, u.phone, u.role, u.created_at,
        COUNT(a.id) as total_appointments
      FROM users u
      LEFT JOIN appointments a ON u.id = a.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `).all();

    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve users.' });
  }
});

// GET /api/admin/settings
router.get('/settings', (req, res) => {
  try {
    const settingsRows = db.prepare('SELECT * FROM site_settings').all();
    const settings = {};
    settingsRows.forEach(r => { settings[r.key] = r.value; });
    return res.json({ settings });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve settings.' });
  }
});

// PUT /api/admin/settings
router.put('/settings', (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Invalid settings payload.' });
    }

    const upsert = db.prepare(`
      INSERT INTO site_settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);

    Object.entries(settings).forEach(([key, value]) => {
      upsert.run(key, String(value));
    });

    return res.json({ message: 'Settings saved successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save settings.' });
  }
});

module.exports = router;

