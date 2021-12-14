const express = require('express');
const http = require('http');
const cors = require('cors'); // socket.io는 cors 처리가 꼭 필요하다

const app = express();
app.use(cors()); // cors middleware 사용

const server = http.createServer(app); // express 서버 생성

// port number & callback function
server.listen(4000, () => {
	console.log('Server is running');
});
