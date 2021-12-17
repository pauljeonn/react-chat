import { useState } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import Chat from './Chat';
import Logo from './images/chatty-logo.svg';

// const socket = io.connect('http://localhost:4000');
const socket = io.connect('https://pauljeonn-chat.herokuapp.com/');

const Container = styled.div`
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const MainScreen = styled.div`
	width: 600px;
	height: 550px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const LogoImg = styled.img`
	width: 150px;
`;

const Title = styled.h1`
	margin: 0 0 15px;
	font-size: 35px;
	color: #a046f0;
`;

const MainWrapper = styled.div`
	width: 500px;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 20px 0;
`;

const Input = styled.input`
	width: 200px;
	height: 50px;
	margin-bottom: 10px;
	border: 3px solid #a046f0;
	border-radius: 5px;
	box-sizing: border-box;
`;

const Button = styled.button`
	width: 200px;
	height: 50px;
	color: white;
	font-size: 20px;
	border: none;
	border-radius: 5px;
	background-color: ${(props) =>
		props.username && props.room ? '#a046f0' : '#c9c9c9'};
	color: ${(props) => (props.username && props.room ? 'white' : '#eeeeee')};
	cursor: ${(props) => (props.username && props.room ? 'pointer' : 'default')};
`;

const ChatScreen = styled.div`
	width: 100%;
	height: 95%;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Back = styled.button`
	margin-top: 50px;
	width: 120px;
	height: 50px;
	/* background-color: #fff566; */
	background-color: white;
	border: 3px solid #a046f0;
	border-radius: 10px;
	color: #a046f0;
	font-size: 16px;
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
						<Back onClick={back}>나가기</Back>
					</ChatScreen>
				) : (
					<MainScreen>
						<LogoImg src={Logo} />
						<Title>CHATTY</Title>
						<MainWrapper>
							<Input
								type="text"
								placeholder="사용자 이름"
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
							<Button username={username} room={room} onClick={joinRoom}>
								채팅 시작
							</Button>
						</MainWrapper>
					</MainScreen>
				)}
			</Container>
		</div>
	);
}

export default App;
