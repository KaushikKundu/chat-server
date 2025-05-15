import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  roomId: string;
  socket: WebSocket;
}
//"room1", new Map([
//   ["user1", socket1],
//   ["user2", socket2],
//   ["user3", socket3],
// ])
let userCount = 0;
let allSockets: User[] = []; // [{roomId:1,socket:ws},{roomId;23,socket:ws},...]

wss.on("connection", (socket) => {
  userCount++;
  console.log("user connected: " + userCount);
  socket.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message.toString());
      const { type, payload } = parsedMessage;
      switch (type) {
        case "join": {
          const { roomId } = payload;
          allSockets.push({ socket, roomId });
          console.log(`User joined room: ${roomId}`);
          break;
        }
        case "chat": {
          const sender = allSockets.find((x) => x.socket === socket);
          if (!sender) return;
          const { roomId } = sender;
          const { message: chatMessage } = payload;
          allSockets
            .filter(x => x.roomId === roomId && x.socket !== socket)
            .forEach((user) => {
              user.socket.send(chatMessage);
            });
          break;
        }
        default :{
            console.warn("Wrong type in payload");
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
});
