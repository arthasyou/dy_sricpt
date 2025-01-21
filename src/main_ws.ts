import { WebSocketService } from "./ws/websocket";

export function startWS() {
  // 创建 WebSocketService 实例，传入 WebSocket 服务器的 URL
  const ws = new WebSocketService("ws://localhost:13785");

  // 监听 WebSocket 的连接状态
  setTimeout(() => {
    // 发送一个 JSON 数据
    const message = { action: "greeting", data: { msg: "Hello, WebSocket!" } };
    const isSent = ws.send(message);

    if (isSent) {
      console.log("Message sent successfully");
    } else {
      console.log("Message is pending and will be sent after reconnect");
    }
  }, 1000); // 延迟 1 秒发送消息

  // // 关闭 WebSocket 连接
  // setTimeout(() => {
  //   ws.close();
  //   console.log("WebSocket connection closed");
  // }, 5000); // 延迟 5 秒关闭连接
}
