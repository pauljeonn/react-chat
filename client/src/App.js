import { useState } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import Chat from './Chat';

const socket = io.connect('http://localhost:4000');

const Container = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
`;

const MainScreen = styled.div`
	width: 600px;
	height: 600px;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #fff566;
`;

const Title = styled.h1`
	color: #a046f0;
`;

const MainWrapper = styled.div`
	width: 500px;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 50px 0;
`;

const Input = styled.input`
	width: 200px;
	height: 25px;
	margin-bottom: 5px;
	box-sizing: border-box;
`;

const Button = styled.button`
	width: 200px;
	height: 35px;
	background-color: #a046f0;
	color: #fff566;
	font-size: 18px;
	border: none;
`;

const ChatScreen = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Back = styled.button`
	margin-top: 100px;
	width: 150px;
	height: 50px;
	background-color: #fff566;
	border: 3px solid #a046f0;
	border-radius: 10px;
	color: #a046f0;
	font-size: 15px;
	font-weight: 600;
	text-align: center;
	cursor: pointer;
`;

function App() {
	const [username, setUsername] = useState('');
	const [room, setRoom] = useState('');
	const [entered, setEntered] = useState(false);

	const joinRoom = () => {
		if (username && room) {
			socket.emit('joinRoom', room); // emit joinRoom with room
			setEntered(true);
		}
	};

	const back = () => {
		setUsername('');
		setRoom('');
		setEntered(false);
	};

	return (
		<div className="App">
			<Container>
				{entered ? (
					<ChatScreen>
						<Chat socket={socket} username={username} room={room} />
						<Back onClick={back}>
							<p>BACK</p>
						</Back>
					</ChatScreen>
				) : (
					<MainScreen>
						<Title>WELCOME TO CHATTY</Title>
						<MainWrapper>
							<Input
								type="text"
								placeholder="유저 이름"
								onChange={(e) => {
									setUsername(e.target.value);
								}}
							/>
							<Input
								type="text"
								placeholder="채팅방 이름"
								onChange={(e) => {
									setRoom(e.target.value);
								}}
							/>
							<Button onClick={joinRoom}>채팅 시작</Button>
						</MainWrapper>
						<div>
							<ul>
								<li>새 브라우저 창에서 다른 유저로 접속해서 테스트해보세요!</li>
							</ul>
						</div>
					</MainScreen>
				)}
			</Container>
		</div>
	);
}

export default App;
