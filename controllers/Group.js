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
            const {name, members, isActive, groupId} = req.body;

            let group = await Groups.findById(groupId);

            if(!group) {
                res.status(404).json({message: "Group not Found!"})
            }

            if(members[0]) {
                for(let userId of members) {
                    let user = await Users.findById(userId);
                    if(!user) {
                        return res.status(400).json({ message: 'User not found' });
                    }
                }

                group.members = members;
            }

            if("isActive" in req.body) {
                group.isActive = isActive;
            }

            if(name) {
                group.name = name;
            }     
            
            await group.save();

            return res.status(200).json({data: group, message: "Success"});
        } catch (error) {
			console.error(error.message);
            res.status(500).json({ message: 'Server Error' });
        }
    },
};