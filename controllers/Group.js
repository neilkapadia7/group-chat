const Users = require("@models/Users");
const Groups = require("@models/Groups");



module.exports = {

    // Post -  api/group/create
    async createGroup(req, res) {
		try {
            const { members, name } = req.body;
            
            for(let userId of members) {
			    let user = await Users.findById(userId);
                if(!user) {
                    return res.status(400).json({ message: 'User not found' });
                }
            }
            
            let group = await new Groups({
                members,
                name,
                createdBy: req.userId
            }).save();

            return res.status(200).json({data: group, message: "Success"});
		} catch (err) {
			console.error(err.message);
			res.status(500).json({ message: 'Server Error' });
		}
    },

    // Post - api/group/getAllGroups
    async getAllGroups(req, res) {
        const { groupIds, search, pageNo } = req.body;
        if(!pageNo) {
            pageNo = 1;
        }

		try {
            let query = {isActive: true};

            if(groupId) {
                query = {_id: {'$in': groupIds}}
            }

            if(search) {
                query = {
                    ...query,
                    name: { $regex: new RegExp(search, 'i') }
                }
            }

            let group = await Groups.find(query)
                .skip(25 * pageNo - 25)
                .limit(25)
                .sort({createdAt:-1});

            return res.status(200).json({data: group, message: "Success"})

			
		} catch (err) {
			console.error(err.message);
			res.status(500).json({ message: 'Server Error' });
		}
    },

    // Post -  api/group/updateGroup
    // Update User
    async updateGroup(req, res) {
        try {
            const {name, members, isActive} = req.body;

            if(!password && !email && !name) {
                return res.status(400).json({message: "Invalid Request"});
            }

            let user = await  Users.findById(userId);
            if(!user) {
                return res.status(400).json({message: "User not found!"});
            }

            if(email) {
    		    const checkEmail = await Users.findOne({email});
                if(checkEmail) {
                    return res.status(400).json({message: "Email Already Exists!"});
                }

                user.email = email;
            }

            if (password) {
                const salt = await bcrypt.genSalt(10);
    			let newPassword = await bcrypt.hash(password, salt);
                
                user.password = newPassword;
            }

            if(name) {
                user.name = name;
            }
            
            await user.save();

            return res.status(200).json({message: "Success"});
        } catch (error) {
			console.error(error.message);
            res.status(500).json({ message: 'Server Error' });
        }
    },
};