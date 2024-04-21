const express = require('express');
const connectDB = require('./config/db');
var cors = require('cors')
require("dotenv").config();
require("module-alias/register");

const app = express();

connectDB();

app.use(express.json({ extended: false }));
app.use(cors())

app.get('/', (req, res) => {
	res.json({ message: 'Welcome to Group Chat' });
});


app.use('/api', require('@routes/index'));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server Started on Port Number: ${PORT}`));
