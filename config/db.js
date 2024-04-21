const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log('MongoDB Connected!');
	} catch (err) {
		console.error("Mongo Error -> ", err.message);
		process.exit(1);
	}
};

module.exports = connectDB;
