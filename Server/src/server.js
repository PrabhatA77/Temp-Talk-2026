import "dotenv/config";
import http from "http";
import app from "./app.js"
import connectDB from "./Config/db.js"
import { setupTempChatWS } from "./websocket/tempChat.ws.js";
import { setupPersistentChatWs } from "./websocket/persistentChat.ws.js";

connectDB();

const port = process.env.PORT || 3000;

// Attach WebSocket server
const server = http.createServer(app);

setupTempChatWS(server)//attach WS to same server, same port
setupPersistentChatWs(server);

server.listen(port,()=>{
    console.log(`Server running on PORT : ${port}`)
})