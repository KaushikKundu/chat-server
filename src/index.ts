import {WebSocketServer, WebSocket} from "ws"

const wss = new WebSocketServer({port:8080});

interface User {
    roomId:string;
    socket:WebSocket;
}

let userCount = 0;
let allSockets:User[] = [];

wss.on("connection", (socket) => {
    userCount++;
    console.log("user connected: " + userCount);
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());
        if(parsedMessage.type == "join") {
            const {roomId} = parsedMessage.payload;
            allSockets.push({
                roomId,
                socket
            })
            console.log("user joined room: " + roomId);
        }

        if(parsedMessage.type == "chat") {
            const {roomId} = parsedMessage.payload;
            
            console.log("user joined room: " + roomId);
        }
        
    })
    
})
