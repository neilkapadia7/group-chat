const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }],
	createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
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
