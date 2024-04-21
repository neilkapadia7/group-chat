const express = require('express');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const Admin = require('../models/Admin');
const adminMiddleware = require('../middleware/admin');

router.use('/admin', require('@routes/admin')); // Renewed
router.use('/auth', require('@routes/Auth')); // Done

module.exports = router;

