import './App.css';
import { useState } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:4000');

function App() {
	const [username, setUsername] = useState('');
	const [room, setRoom] = useState('');

	const joinRoom = () => {
		if (username && room) {
			socket.emit('joinRoom', room); // emit joinRoom with room
		}
	};

	return (
		<div className="App">
			<h3>Join Chat</h3>
			<input
				type="text"
				placeholder="유저 이름"
				onChange={(e) => {
					setUsername(e.target.value);
				}}
			/>
			<input
				type="text"
				placeholder="채팅방 이름"
				onChange={(e) => {
					setRoom(e.target.value);
				}}
			/>
			<button onClick={joinRoom}>Join Room</button>
		</div>
	);
}

export default App;
