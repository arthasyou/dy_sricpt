import { WebSocketService } from "./ws/websocket";

const ws = new WebSocketService("ws://localhost:13785");

console.log("WebSocket 服务已启动");
