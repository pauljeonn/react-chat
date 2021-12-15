const express = require('express');
const http = require('http');
const cors = require('cors'); // socket.io는 cors 처리가 꼭 필요하다
const { Server } = require('socket.io');

const app = express();
app.use(cors()); // cors middleware 사용

const server = http.createServer(app); // express 서버 생성

// pass server & object for cors (cors 이슈 해결)
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
	},
});

// socket io connection 이벤트 핸들링
io.on('connection', (socket) => {
	console.log(`User connected: ${socket.id}`);

	// joinRoom 이벤트 - join with id
	socket.on('joinRoom', (id) => {
		socket.join(id);
		console.log(`User with ID: ${socket.id} joined room: ${id}`);
	});

	// sendMessage 이벤트
	socket.on('sendMessage', (data) => {
		console.log(data);
	});

	// disconnect 이벤트 핸들링
	socket.on('disconnect', () => {
		console.log('User Disconnected: ', socket.id);
	});
});

// port number & callback function
server.listen(4000, () => {
	console.log('Server is running');
});
