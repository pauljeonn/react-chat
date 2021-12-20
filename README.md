# Chatty

Socket.io를 사용하여 구현한 채팅앱 입니다. 
사용자 이름과 채팅방 이름을 입력하여 채팅을 시작할 수 있으며 동일한 채팅방에 접속한 여러명의 사용자들이 동시에 사용 가능합니다. 
Real-time communication에 한계를 가지는 HTTP와는 달리 양방향 서버와 클라이언트 사이에 지속적으로 연결된 TCP 라인을 통해 실시간 통신을 가능하게 해주는 websocket 구조의 장점에 대해 배울 수 있었습니다. 
또한 기존의 Websocket과 차별점을 갖는 Socket.io만의 브로드캐스팅 기능은 여러 사람이 같은 장소에서 메시지를 주고받는 채팅앱을 구현할때 특히 유용했습니다.

## Contributor

@pauljeonn (전바울)

## Tech Stack

- Frontend: React, styled-components
- Backend: Node.js, Express, Socket.io
- Deployment: Heroku(Server), Netlify(Client)
