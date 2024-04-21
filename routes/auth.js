const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const User = require('@models/Users/User');
const AuthController = require('@controllers/Auth');
const AdminController = require('@controllers/AdminController');
const auth = require('@middleware/auth');

// @route   GET    api/auth
// @desc    Get Logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user).select('-password').populate('instituteId');
		res.status(200).json({data: user});
	} catch (error) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route  POST    api/auth/login
// @desc   User LogIn
// @access   Public
router.post(
	'/login',
	[
		check('email', 'Please Include a Valid Email Id').isEmail(),
		check('password', 'Please enter your password').not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		AuthController.loginUser(req, res);
	}
);

// @route  POST    api/auth/signup
// @desc   User Creation
// @access  Public
router.post(
	'/signup',
	[
		check('name', 'Please Include Name').isString(),
		check('email', 'Please Include a Valid Email Id').isEmail(),
		check('password', 'Please enter your password').not().isEmpty(),
		check('isManualUserGeneration', 'Please enter isManualUserGeneration').isBoolean().optional(),
		check('accessType', 'Please enter your accessType').isString(),
		check('batchId', 'Please enter your batchId').isString().optional(),
	],
	async (req, res) => {
		
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		AuthController.createUser(req, res);
	}
);

// @route  POST    api/auth/passwordChange
// @desc   User Password Update
// @access  Public
router.post(
	'/passwordChange',
	[
		check('email', 'Please Include a Valid Email Id').isEmail(),
		check('password', 'Please enter your password').not().isEmpty(),
	],
	auth,
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const checkUser = await User.findOne({email});
		if(req.isAdminUser || (checkUser && checkUser._id == req.userId)) {
			AuthController.updatePassword(req, res, checkUser);
		}
		else {
			return res.status(400).json({ message: "Invalid Access" });
		}
	}
);

// @route   GET    api/auth/getAllUsers
// @desc    Get All Users
// @access  Private
router.get('/getAllUsers',
	auth,
	async (req, res) => {
		// if(!req.isAdminUser) {
		// 	return res.status(401).json({message: "Invalid Access"})
		// }

		AdminController.getAllUsers(req, res);
	}
);

module.exports = router;
