const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const GroupController = require('@controllers/Auth');
const auth = require('@middleware/auth');

// @route  POST    api/group/create
// @desc   Group Creation
// @access  Private
router.post(
	'/create',
    auth,
	[
		check('members', 'Please Include Members').isArray(),
		check('name', 'Please Include a Valid Name').isString(),
	],
	async (req, res) => {
		
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		GroupController.createGroup(req, res);
	}
);

// @route  POST    api/group/getAllGroups
// @desc   Get All Groups with Search and Get Specific Groups
// @access  Private
router.post(
	'/getAllGroups',
	auth,
	[
		check('groupIds', 'Please Include a Valid GroupIds').isArray().optional(),
		check('search', 'Please Include a Valid Name').isString().optional(),
		check('pageNo', 'Please Include a Page No').isNumeric().optional()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
        }

		return GroupController.getAllGroups(req, res);
	}
);

// @route   POST    api/group/updateGroup
// @desc    Update Group
// @access  Private
router.post('/updateGroup',
	auth,
    [
		check('groupId', 'Please Include a Valid UserId').isString(),
		check('name', 'Please Include a Valid UserId').isString().optional(),
		check('members', 'Please Include a Valid Name').isString().optional(),
		check('isActive', 'Please Include a Valid Email Id').isBoolean().optional()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
        }

		GroupController.updateGroup(req, res);
	}
);

module.exports = router;
