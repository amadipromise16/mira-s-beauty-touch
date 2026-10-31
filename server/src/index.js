require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('node:path');
const seedDatabase = require('./seed');

// Run seed on startup if fresh
try {
  seedDatabase();
} catch (e) {
  console.error('Seed error:', e);
}

const authRoutes = require('./routes/auth');
const servicesRoutes = require('./routes/services');
const perfumesRoutes = require('./routes/perfumes');
const galleryRoutes = require('./routes/gallery');
const appointmentsRoutes = require('./routes/appointments');
const notificationsRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors({
  origin: '*', // Allow client connections
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads and client media assets
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/media', express.static(path.join(__dirname, '..', '..', 'client', 'public', 'media')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/perfumes', perfumesRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: "Mira's Beauty Touch",
    timestamp: new Date().toISOString()
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'An unexpected internal server error occurred.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Mira’s Beauty Touch backend server running on http://localhost:${PORT}`);
});

