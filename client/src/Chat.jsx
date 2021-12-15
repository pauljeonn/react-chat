import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { RiSendPlane2Fill } from 'react-icons/ri';

const Container = styled.div`
	margin-top: 50px;
	width: 400px;
	display: flex;
	flex-direction: column;
`;

const Header = styled.div`
	width: 100%;
	height: 100px;
	background-color: #a046f0;
	color: #fff566;
	font-size: 30px;
	font-weight: 500;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
`;

const Body = styled.div`
	width: 100%;
	height: 600px;
	border: 10px solid #a046f0;
	box-sizing: border-box;
	overflow: auto;
	flex-grow: 1;
	/* background-color: #fff566; ; */
`;

const Footer = styled.div`
	width: 100%;
	height: 100px;
	background-color: #a046f0;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Input = styled.input`
	width: 280px;
	height: 70px;
	border: none;
	box-sizing: border-box;
	border-radius: 5px;
	margin-right: 15px;
`;

const Button = styled.button`
	width: 60px;
	height: 60px;
	background-color: #fff566;
	color: #a046f0;
	border: none;
	border-radius: 50%;
`;

const Message = styled.div`
	margin-top: 10px;
	width: 100%;
	display: flex;
	justify-content: ${(props) =>
		props.author === props.user ? 'flex-end' : 'flex-start'};
`;

const MessageBox = styled.div`
	width: auto;
	max-width: 120px;
	display: flex;
	word-wrap: break-word;
	border-radius: 5px;
	background-color: ${(props) =>
		props.author === props.user ? '#a046f0' : '#d7f9ff'};
	color: ${(props) => (props.author === props.user ? 'white' : 'black')};
	padding: 15px;
`;

const MessageUser = styled.div``;

const MessageContent = styled.div``;

const MessageTime = styled.div``;

// socket, username, room 값을 인자로 받는다
const Chat = ({ socket, username, room }) => {
	const [currentMessage, setCurrentMessage] = useState('');
	const [messageList, setMessageList] = useState([]);
	// auto scroll to bottom 위해서 useRef 사용
	const messageEnd = useRef(null);

	const sendMessage = async () => {
		if (currentMessage) {
			// 메시지 데이터 생성
			const messageData = {
				room: room,
				author: username,
				message: currentMessage,
				time:
					new Date(Date.now()).getHours() +
					':' +
					(new Date(Date.now()).getMinutes() < 10 ? '0' : '') +
					new Date(Date.now()).getMinutes(),
			};

			// 메시지 emit
			await socket.emit('sendMessage', messageData);
			setMessageList((messageList) => [...messageList, messageData]);

			// input text clear해주기
			setCurrentMessage('');
		}
	};

	useEffect(() => {
		socket.on('receiveMessage', (data) => {
			// 새로운 메시지 messageList에 추가
			setMessageList((messageList) => [...messageList, data]);
		});
	}, [socket]); // socket에 변화가 있을때만 작동

	// messageList의 변화가 있을때, 즉 새로운 메시지가 생기면 자동으로 scroll to bottom
	useEffect(() => {
		messageEnd.current.scrollIntoView({ behavior: 'smooth' });
	}, [messageList]);

	return (
		<Container>
			<Header>
				<p>{room}</p>
			</Header>
			<Body>
				{messageList.map((messageData) => {
					return (
						<Message author={messageData.author} user={username}>
							<MessageBox author={messageData.author} user={username}>
								<MessageUser>{messageData.username}</MessageUser>
								<MessageContent>{messageData.message}</MessageContent>
							</MessageBox>
							<MessageTime>{messageData.time}</MessageTime>
						</Message>
					);
				})}
				{/* 마지막 채팅 위치 */}
				<div ref={messageEnd}></div>
			</Body>
			<Footer>
				<Input
					type="text"
					placeholder="메시지를 입력해주세요"
					onChange={(e) => setCurrentMessage(e.target.value)}
					// 엔터키 입력해도 sendMessage
					onKeyPress={(e) => {
						e.key === 'Enter' && sendMessage();
					}}
					value={currentMessage}
				/>
				<Button onClick={sendMessage}>
					<RiSendPlane2Fill style={{ fontSize: '24px', color: '#a046f0' }} />
				</Button>
			</Footer>
		</Container>
	);
};

export default Chat;
