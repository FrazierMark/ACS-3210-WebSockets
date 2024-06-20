const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

let userCount = 0;

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
	console.log('a user connected');

	userCount++;
	io.emit('user joined', {
		count: userCount,
		id: socket.id,
	});

	socket.on('chat message', (msg) => {
		io.emit('chat message', msg);
	});

	socket.on('typing', () => {
		socket.broadcast.emit('typing', socket.id);
	});

	socket.on('stop typing', () => {
		socket.broadcast.emit('stop typing', socket.id);
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');

		userCount--;
		io.emit('user left', userCount);
	});
});

server.listen(3000, () => {
	console.log('listening on *:3000');
});
