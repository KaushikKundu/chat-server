"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let userCount = 0;
let allSockets = [];
wss.on("connection", (socket) => {
    allSockets.push(socket);
    userCount++;
    console.log("user connected: " + userCount);
    socket.on("message", (message) => {
        console.log("message:" + message.toString());
        socket.send(message.toString() + " :sent from server");
        for (let i = 0; i < allSockets.length; i++) {
            const s = allSockets[i];
            s.send(message.toString() + ": sent from server");
        }
    });
});
