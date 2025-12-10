const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const adminRoutes = require('./routes/admin'); // ✅ added admin routes

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes); // ✅ added admin route mount point

// Serve frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/auth.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

app.get('/raise-complaint', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/raise-complaint.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// ✅ Optional route safety (handles 404 for unknown API routes)
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  next();
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Smart Surat City Portal running on http://localhost:${PORT}`);
});
