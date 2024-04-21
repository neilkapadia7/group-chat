const jwt = require('jsonwebtoken');
const Users = require("@models/User");

module.exports = async function (req, res, next) {
	const authorizationHeader = req.headers["authorization"]
	if (!authorizationHeader) return res.status(401).json({
		status: false,
		message: "Access denied. No token provided."
	});
	const authorization = authorizationHeader.split(" ");
	const token = authorization[1];

	if (!token) {
		return res.status(402).json({ message: 'No Token, Authorization Denied' });
	}
	try {
		// const decoded = jwt.verify(token, config.get('jwtSecret'));
		const decoded = jwt.verify(token, process.env.jwtSecret);

		req.user = decoded.user.id;
		req.userId = decoded.user.id;
		
		req.isAdminUser =false;
		let checkUser = await Users.findById({_id: req.user}, {isAdminUser: 1});
		if(checkUser) {
			if(checkUser.isAdminUser)
				req.isAdminUser = checkUser.isAdminUser
		} else {
			return res.status(401).json({ message: 'User not found' });
		}

		
		next();
	} catch (err) {
		console.log(err)
		return res.status(401).json({ message: 'Token is not Valid' });
	}
};
