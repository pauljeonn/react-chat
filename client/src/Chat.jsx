import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { RiSendPlane2Fill } from 'react-icons/ri';
import { IoExitOutline } from 'react-icons/io5';

const Container = styled.div`
	width: 400px;
	height: 90%;
	max-height: 800px;
	display: flex;
	flex-direction: column;
	@media (max-width: 480px) {
		width: 100%;
	}
`;

const Header = styled.div`
	width: 100%;
	height: 70px;
	background-color: #a046f0;
	border: 5px solid #a046f0;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	color: white;
	padding: 10px 15px 0;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const RoomTitle = styled.div`
	font-size: 18px;
	font-weight: 500;
	margin-bottom: 5px;
`;

const LeaveButton = styled.div`
	font-size: 24px;
	cursor: pointer;
`;

const Body = styled.div`
	width: 100%;
	max-height: 600px;
	border: 5px solid #a046f0;
	border-bottom: none;
	background-color: white;
	box-sizing: border-box;
	overflow: auto;
	flex-grow: 1;
	padding: 10px 0;
	@media (max-width: 480px) {
		/* height: 400px;
		max-height: 400px; */
	}
`;

const Footer = styled.div`
	width: 100%;
	height: 120px;
	background-color: #e8e8e8;
	border: 5px solid #a046f0;
	border-top: none;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ChatArea = styled.div`
	width: 360px;
	height: 90px;
	background-color: white;
	border-radius: 5px;
	display: flex;
	align-items: center;
	@media (max-width: 480px) {
		width: 90%;
	}
`;

const Textarea = styled.textarea`
	width: 280px;
	height: 70px;
	rows: 1;
	border: none;
	border-radius: 10px;
	box-sizing: border-box;
	padding-left: 8px;
	margin-right: 12px;
	font-family: 'Noto Sans KR', sans-serif;
	outline: none;
	resize: none;
	@media (max-width: 480px) {
		width: 75%;
	}
`;

const Button = styled.button`
	width: 60px;
	height: 60px;
	background-color: #a046f0;
	color: white;
	border: none;
	border-radius: 50%;
	cursor: pointer;
	background-color: ${(props) =>
		props.currentMessage ? '#a046f0' : '#e8e8e8'};
`;

const Message = styled.div`
	margin-top: 10px;
	width: 100%;
	box-sizing: border-box;
	display: flex;
	/* flex-direction: column; */
	justify-content: ${(props) =>
		props.author === props.user ? 'flex-end' : 'flex-start'};
`;

const MessageBox = styled.div`
	width: auto;
	max-width: 180px;
	display: flex;
	flex-direction: column;
	word-wrap: break-word;
	border-radius: 5px;
	background-color: ${(props) =>
		props.author === props.user ? '#a046f0' : '#d7f9ff'};
	color: ${(props) => (props.author === props.user ? 'white' : 'black')};
	padding: ${(props) =>
		props.author === props.user ? '10px 15px' : '5px 15px 10px'};
`;

const MessageUser = styled.div`
	font-size: 11px;
	color: gray;
`;

const MessageContent = styled.div``;

const MessageTime = styled.div`
	display: flex;
	align-items: flex-end;
	font-size: 11px;
	margin: 3px 5px;
`;

// socket, username, room ?????? ????????? ?????????
const Chat = ({ socket, username, room, leave }) => {
	const [currentMessage, setCurrentMessage] = useState('');
	const [messageList, setMessageList] = useState([]);
	// auto scroll to bottom ????????? useRef ??????
	const messageEnd = useRef(null);
	const textArea = useRef();

	const sendMessage = async (e) => {
		e.preventDefault();

		if (currentMessage) {
			// ????????? ????????? ??????
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

			// ????????? emit
			await socket.emit('sendMessage', messageData);
			setMessageList((messageList) => [...messageList, messageData]);

			// input text clear?????????
			setCurrentMessage('');
			textArea.current.focus();
		}
	};

	useEffect(() => {
		socket.on('receiveMessage', (data) => {
			// ????????? ????????? messageList??? ??????
			setMessageList((messageList) => [...messageList, data]);
		});
	}, [socket]); // socket??? ????????? ???????????? ??????

	// messageList??? ????????? ?????????, ??? ????????? ???????????? ????????? ???????????? scroll to bottom
	useEffect(() => {
		messageEnd.current.scrollIntoView({ behavior: 'smooth' });
	}, [messageList]);

	return (
		<Container>
			<Header>
				<RoomTitle>{room}</RoomTitle>
				<LeaveButton onClick={() => leave()}>
					<IoExitOutline />
				</LeaveButton>
			</Header>
			<Body>
				{messageList.map((messageData) => {
					return (
						<Message author={messageData.author} user={username}>
							<MessageTime>
								{messageData.author === username && messageData.time}
							</MessageTime>
							<MessageBox author={messageData.author} user={username}>
								<MessageUser>
									{messageData.author !== username && messageData.author}
								</MessageUser>
								<MessageContent>{messageData.message}</MessageContent>
							</MessageBox>
							<MessageTime>
								{messageData.author !== username && messageData.time}
							</MessageTime>
						</Message>
					);
				})}
				{/* ????????? ?????? ?????? */}
				<div ref={messageEnd}></div>
			</Body>
			<Footer>
				<ChatArea>
					<Textarea
						ref={textArea}
						type="text"
						placeholder="???????????? ??????????????????."
						onChange={(e) => setCurrentMessage(e.target.value)}
						// ????????? ???????????? sendMessage
						onKeyPress={(e) => {
							e.key === 'Enter' && sendMessage(e);
						}}
						value={currentMessage}
					/>
					<Button currentMessage={currentMessage} onClick={sendMessage}>
						<RiSendPlane2Fill style={{ fontSize: '26px', color: 'white' }} />
						{/* SEND */}
					</Button>
				</ChatArea>
			</Footer>
		</Container>
	);
};

export default Chat;
