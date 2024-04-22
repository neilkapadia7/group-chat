const express = require('express');
const connectDB = require('./config/db');
var cors = require('cors')
require("dotenv").config();
require("module-alias/register");
const jwt = require("jsonwebtoken");

const http = require("http");
const socketIo = require('socket.io');

const Users = require("@models/Users");
const Groups = require("@models/Groups");

const app = express();

connectDB();

app.use(express.json({ extended: false }));
app.use(cors())

app.get('/', (req, res) => {
	res.json({ message: 'Welcome to Group Chat' });
});


app.use('/api', require('@routes/index'));


const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: "*"
	}
});

io.use(async (socket, next) => {
    let err  = new Error('Authentication error');
    
    const headers = socket.handshake.headers;
    const authToken = headers['authorization']; 

	console.log("SOCKERT - >", socket.params);

    if(!authToken) {
        return next(err);
    }

    const authorization = authToken.split(" ");
	const token = authorization[1];

    if(!token) {
        return next(err);
    }

    const decoded = jwt.verify(token, process.env.jwtSecret);
	
	let checkUser = await Users.findById({_id: decoded.user.id});

    if(checkUser) {
        
        socket.userId = checkUser._id;
        next();
    } else {
        next(err);
    }
  });

const usersSocket = {};

// Listen for connection event
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', async (groupId, userId) => {
        console.log(`User ${socket.userId} joined group ${groupId}`);;
		let groupcheck = await Groups.findOne({_id: socket.groupId, members: {$in: [socket.userId]}});
        if(!groupcheck) {
			// No Message Sent
            console.log("Invalid Group");
			return;
		}
        if (!usersSocket[groupId]) {
        usersSocket[groupId] = {};
        }
        usersSocket[groupId][userId] = socket;
    });

    socket.on('message', (groupId, userId) => {


        console.log(`Message received in group ${groupId}: ${message}`);
        // Broadcast the message to all usersSocket in the group
        if (usersSocket[groupId]) {
        for (let userId in usersSocket[groupId]) {
            usersSocket[groupId][userId].emit('message', message);
        }
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        for (let groupId in usersSocket) {
        if (usersSocket[groupId][socket.id]) {
            delete usersSocket[groupId][socket.id];
            break;
        }
        }
    });

    socket.on("error", (err) => {
        console.log("Error", err);
    })
});



const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server Started on Port Number: ${PORT}`));
