import React, { useEffect, useState } from 'react';

// socket, username, room 값을 인자로 받는다
const Chat = ({ socket, username, room }) => {
	const [currentMessage, setCurrentMessage] = useState('');
	const [messageList, setMessageList] = useState([]);

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
					new Date(Date.now()).getMinutes(),
			};

			// 메시지 emit
			await socket.emit('sendMessage', messageData);
			setMessageList((messageList) => [...messageList, messageData]);
		}
	};

	useEffect(() => {
		socket.on('receiveMessage', (data) => {
			// 새로운 메시지 messageList에 추가
			setMessageList((messageList) => [...messageList, data]);
		});
	}, [socket]); // socket에 변화가 있을때만 작동

	return (
		<div>
			<div className="chat-header">
				<p>Live Chat</p>
			</div>
			<div className="chat-body">
				{messageList.map((messageData) => {
					return <p>{messageData.message}</p>;
				})}
			</div>
			<div className="chat-footer">
				<input
					type="text"
					placeholder="메시지를 입력해주세요"
					onChange={(e) => setCurrentMessage(e.target.value)}
				/>
				<button onClick={sendMessage}>전송</button>
			</div>
		</div>
	);
};

export default Chat;
