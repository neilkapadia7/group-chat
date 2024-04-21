const Users = require("@models/Users");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const {createUserToken} = require("@service/createToken")



module.exports = {

    // Post -  api/auth/login
    async loginUser(req, res) {
        const { email, password } = req.body;

		try {
			let user = await Users.findOne({ email });

			if (!user) {
				return res.status(400).json({ message: 'Invalid Email Id / User not found' });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ message: 'Invalid Password' });
			}

			let generateToken = await createUserToken(user.id);

            if(!generateToken.isError) {
                return res.status(200).json({token: generateToken.token});
            } else {
                console.log(generateToken.error)
                return res.status(400).json({message: "Server Error"});
            }
		} catch (err) {
			console.error(err.message);
			res.status(500).json({ message: 'Server Error' });
		}
    },

    // Post -  api/auth/signup
    // Add new user
    async createUser(req, res) {
        const { name, email, password } = req.body;

		try {
            let user = await Users.findOne({ email });

			if (user) {
				return res.status(400).json({ message: 'User with email already exists' });
			}

            let newUser = await new Users({
                name,
                email
            })

            const salt = await bcrypt.genSalt(10);
			let newPassword = await bcrypt.hash(password, salt);

            newUser.password = newPassword;
            
            await newUser.save();


            // Since User is created by admin no token will be generated
            // let generateToken = await createUserToken(newUser.id);
            // if(!generateToken.isError) {
            //     return res.status(200).json({token: generateToken.token});
            // } else {
            //     console.log(generateToken.error)
            //     return res.status(400).json({message: "Server Error"});
            // }

            return res.status(200).json({data: newUser, message: "Success"})

			
		} catch (err) {
			console.error(err.message);
			res.status(500).json({ message: 'Server Error' });
		}
    },

    // Post -  api/auth/passwordChange
    // Update User Password
    async updatePassword(req, res, user) {
        try {
            const {password} = req.body;
            const salt = await bcrypt.genSalt(10);

			let newPassword = await bcrypt.hash(password, salt);
            user.password = newPassword;
            await user.save();

            return res.status(200).json({message: "Success"});
        } catch (error) {
			console.error(error.message);
            res.status(500).json({ message: 'Server Error' });
        }
    }
};