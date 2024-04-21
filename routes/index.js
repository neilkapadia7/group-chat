const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// router.use('/admin', require('@routes/admin')); // Renewed
router.use('/auth', require('@routes/auth')); // Done

module.exports = router;

