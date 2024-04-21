const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	name: { // fullname
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	isAdminUser: {
		type: Boolean,
		default: false
	},
    token: {type: String}, // Storing token in DB to have one user login at a time (if needed)
	isActive: {type: Boolean, default: true},
}, 
{
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
  );

module.exports = mongoose.model('Users', UserSchema);
