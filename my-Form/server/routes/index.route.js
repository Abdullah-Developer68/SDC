const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth.route');

// Use routes
router.use('/auth', authRoutes);

module.exports = router;