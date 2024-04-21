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
