import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });


const rooms = new Map<string, Set<WebSocket>>();

wss.on("connection", function (socket: WebSocket) {
    console.log("connected");

    socket.on("message", function (data) {
        try {
            const parsedData = JSON.parse(data.toString());
            const { type, payload } = parsedData;
            const { roomId } = payload;
            
            switch (type) {
                case "join": {
                    if (!rooms.has(roomId)) {
                        rooms.set(roomId, new Set());
                    }
                    const usersInRoom = rooms.get(roomId);
                    if (usersInRoom?.has(socket)) {
                        socket.send("already in room")
                        return;
                    }
                    usersInRoom?.add( socket);
                    console.log(`joined room ${roomId}`);
                    break;
                }
                case "chat": {
                    const { message: chatMessage } = payload;
                    const usersInRoom = rooms.get(roomId);
                    console.log(usersInRoom?.entries());
                    if(!usersInRoom){
                        console.log("room doesn't exist");
                        return ;
                    }
                    console.log("Broadcasting to:", usersInRoom?.size, "users");
                    for (const client of usersInRoom) {//socket represents current sender, client means others in room
                        if (client !== socket && client.readyState === WebSocket.OPEN) {
                            client.send(chatMessage);
                        }
                    }
                    break;
                }
            }
            for(const [id,clients] of rooms.entries()){
                console.log(`${id} has ${clients.size}`);
            }
        } catch (err) {
            console.error(err);
        }
    });
    socket.on("close",() => {
        for(const [id,sockets] of rooms.entries() ){
            if(sockets.delete(socket)){
                console.log("socket removed from " + id);
            }
            if(sockets.size === 0){
                rooms.delete(id);
                console.log("room deleted");
            }
        }
    })
});
