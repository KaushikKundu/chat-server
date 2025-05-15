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
        var _a;
        const parsedMessage = JSON.parse(message.toString());
        try {
            if (parsedMessage.type == "join") {
                const { roomId } = parsedMessage.payload;
                allSockets.push({
                    roomId,
                    socket
                });
                console.log("user joined room: " + roomId);
            }
            if (parsedMessage.type == "chat") {
                // find current user roomID
                const currentUserRoomId = (_a = allSockets.find(x => x.socket === socket)) === null || _a === void 0 ? void 0 : _a.roomId;
                allSockets.forEach(user => {
                    if (user.roomId === currentUserRoomId) {
                        user.socket.send(parsedMessage.payload.message);
                    }
                });
            }
        }
        catch (err) {
            console.log(err);
        }
    });
});
