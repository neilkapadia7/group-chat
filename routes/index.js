const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

router.use('/group', require('@routes/group')); 
router.use('/auth', require('@routes/auth')); 

module.exports = router;

