const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Helper to generate booking reference
function generateBookingRef() {
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  const year = new Date().getFullYear();
  return `MBT-${year}-${random}`;
}

// POST /api/appointments - Customer creates booking
router.post('/', requireAuth, (req, res) => {
  try {
    const {
      service_id,
      service_name,
      stylist_name,
      customer_name,
      customer_email,
      customer_phone,
      requested_date,
      requested_time,
      customer_notes
    } = req.body;

    if (!service_name || !requested_date || !requested_time || !customer_name || !customer_phone) {
      return res.status(400).json({
        error: 'Please provide all required appointment fields: service, customer name, phone, date, and time slot.'
      });
    }

    // Validate date is not past
    const today = new Date().toISOString().split('T')[0];
    if (requested_date < today) {
      return res.status(400).json({ error: 'Appointment date cannot be in the past.' });
    }

    // Availability / Double-booking protection:
    // Check if an approved appointment already exists for this date, time and stylist
    const conflictStmt = db.prepare(`
      SELECT id FROM appointments 
      WHERE requested_date = ? 
        AND requested_time = ? 
        AND status = 'approved'
        ${stylist_name ? 'AND stylist_name = ?' : ''}
    `);
    const conflictParams = stylist_name 
      ? [requested_date, requested_time, stylist_name]
      : [requested_date, requested_time];
    const existingConflict = conflictStmt.get(...conflictParams);

    if (existingConflict) {
      return res.status(409).json({
        error: 'The requested time slot is already fully booked. Please choose an alternative time slot.'
      });
    }

    const booking_ref = generateBookingRef();

    const insertStmt = db.prepare(`
      INSERT INTO appointments (
        booking_ref, user_id, service_id, service_name, stylist_name,
        customer_name, customer_email, customer_phone, requested_date,
        requested_time, status, customer_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
    `);

    const result = insertStmt.run(
      booking_ref,
      req.user.id,
      service_id ? Number(service_id) : null,
      service_name.trim(),
      stylist_name ? stylist_name.trim() : 'Any Available Specialist',
      customer_name.trim(),
      customer_email ? customer_email.trim() : req.user.email,
      customer_phone.trim(),
      requested_date,
      requested_time,
      customer_notes ? customer_notes.trim() : null
    );

    const appointmentId = Number(result.lastInsertRowid);

    // Create confirmation in-app notification for the customer
    const notifStmt = db.prepare(`
      INSERT INTO notifications (user_id, type, title, message, appointment_id)
      VALUES (?, 'system', 'Appointment Request Submitted', ?, ?)
    `);
    notifStmt.run(
      req.user.id,
      `Your booking request for "${service_name}" on ${requested_date} at ${requested_time} has been submitted (Ref: ${booking_ref}). It is currently pending salon administrator approval.`,
      appointmentId
    );

    const newAppointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(appointmentId);

    return res.status(201).json({
      message: 'Appointment submitted successfully. Awaiting salon administrator confirmation.',
      appointment: newAppointment
    });
  } catch (err) {
    console.error('Create appointment error:', err);
    return res.status(500).json({ error: 'Failed to submit appointment.' });
  }
});

// GET /api/appointments/my-bookings - Customer's bookings
router.get('/my-bookings', requireAuth, (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT a.*, s.price_ngn, s.duration_mins, s.image_url as service_image
      FROM appointments a
      LEFT JOIN services s ON a.service_id = s.id
      WHERE a.user_id = ?
      ORDER BY a.requested_date DESC, a.id DESC
    `);
    const bookings = stmt.all(req.user.id);
    return res.json({ bookings });
  } catch (err) {
    console.error('Fetch customer bookings error:', err);
    return res.status(500).json({ error: 'Failed to retrieve bookings.' });
  }
});

// POST /api/appointments/:id/cancel - Customer can cancel their pending appointment
router.post('/:id/cancel', requireAuth, (req, res) => {
  try {
    const checkStmt = db.prepare('SELECT * FROM appointments WHERE id = ? AND user_id = ?');
    const apt = checkStmt.get(req.params.id, req.user.id);

    if (!apt) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    if (apt.status === 'completed' || apt.status === 'cancelled') {
      return res.status(400).json({ error: `Appointment is already ${apt.status}.` });
    }

    const cancelStmt = db.prepare(`
      UPDATE appointments 
      SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    cancelStmt.run(apt.id);

    // Notification
    const notif = db.prepare(`
      INSERT INTO notifications (user_id, type, title, message, appointment_id)
      VALUES (?, 'system', 'Appointment Cancelled', ?, ?)
    `);
    notif.run(
      req.user.id,
      `Your appointment (Ref: ${apt.booking_ref}) for ${apt.service_name} on ${apt.requested_date} has been cancelled.`,
      apt.id
    );

    return res.json({ message: 'Appointment cancelled successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to cancel appointment.' });
  }
});

// GET /api/appointments/availability?date=YYYY-MM-DD
// Returns booked slots for that day
router.get('/availability', (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required.' });
    }

    const stmt = db.prepare(`
      SELECT requested_time, stylist_name 
      FROM appointments 
      WHERE requested_date = ? AND status = 'approved'
    `);
    const booked = stmt.all(date);

    return res.json({
      date,
      booked_slots: booked.map(b => ({ time: b.requested_time, stylist: b.stylist_name }))
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to check availability.' });
  }
});

module.exports = router;

