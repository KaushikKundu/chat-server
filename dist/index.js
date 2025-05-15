"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let userCount = 0;
let allSockets = []; // [{roomId:1,socket:ws},{roomId;23,socket:ws},...]
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
                    if (!sender)
                        return;
                    const { roomId } = sender;
                    const { message: chatMessage } = payload;
                    allSockets
                        .filter(x => x.roomId === roomId && x.socket !== socket)
                        .forEach((user) => {
                        user.socket.send(chatMessage);
                    });
                    break;
                }
                default: {
                    console.warn("Wrong type in payload");
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    });
});
