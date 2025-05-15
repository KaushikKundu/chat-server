import {WebSocketServer, WebSocket} from "ws"

const wss = new WebSocketServer({port:8080});

interface User {
    roomId:string;
    socket:WebSocket;
}

let userCount = 0;
let allSockets:User[] = []; // [{roomId:1,socket:ws},{roomId;23,socket:ws},...]

wss.on("connection", (socket) => {
    userCount++;
    console.log("user connected: " + userCount);
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());
        try{

            if(parsedMessage.type == "join") {
                const {roomId} = parsedMessage.payload;
                allSockets.push({
                    roomId,
                    socket
                })
                console.log("user joined room: " + roomId);
            }
            
            if(parsedMessage.type == "chat") {
                // find current user roomID
                const currentUserRoomId = allSockets.find(x => x.socket === socket)?.roomId;
                allSockets.forEach(user  => {
                    if(user.roomId === currentUserRoomId){
                        user.socket.send(parsedMessage.payload.message);
                    }
                })
                
            }
        }catch(err){
            console.log(err);
        }
        
    })
    
})
