import { customEmitter } from "../customEvent";

export class WebSocketService {
  private socket!: WebSocket;
  private reconnectAttempts: number = 0;
  private static maxReconnectAttempts: number = 5;
  private static reconnectInterval: number = 3000;
  private pendingMessages: { data: object }[] = []; // 暂存待发送的消息队列
  private url: string;

  private pingInterval: NodeJS.Timeout | null = null; // 定时器，用于发送心跳包

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  public static setMaxReconnectAttempts(attempts: number) {
    WebSocketService.maxReconnectAttempts = attempts;
  }

  public static setReconnectInterval(interval: number) {
    WebSocketService.reconnectInterval = interval;
  }

  private connect() {
    this.socket = new WebSocket(this.url);
    this.initialize();
  }

  private initialize() {
    this.socket.onopen = () => {
      console.log(`Connected to WebSocket server at ${this.url}`);
      this.reconnectAttempts = 0;
      this.flushPendingMessages(); // 重新连接后发送所有暂存的消息

      // 开始定时发送 ping 消息
      this.startPing();
    };

    this.socket.onmessage = (event) => {
      const message = event.data;
      try {
        const jsonData = JSON.parse(message); // 解析 JSON 字符串
        if (jsonData.type === "ping") {
          return; // 忽略 ping 消息，直接返回
        }
        console.log("Received message:", jsonData);
        customEmitter.emit("sms", jsonData);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };

    this.socket.onclose = () => {
      console.log(`Disconnected from WebSocket server at ${this.url}`);
      this.handleReconnect();
      this.stopPing(); // 停止心跳
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.handleReconnect();
      this.stopPing(); // 停止心跳
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < WebSocketService.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect to ${this.url}... (${this.reconnectAttempts}/${WebSocketService.maxReconnectAttempts})`
      );
      setTimeout(() => {
        this.connect();
      }, WebSocketService.reconnectInterval);
    } else {
      console.error(
        `Max reconnect attempts reached for ${this.url}. Could not reconnect.`
      );
    }
  }

  // 发送 ping 消息以保持连接
  private startPing() {
    this.pingInterval = setInterval(() => {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: "ping" })); // 发送 ping 消息
      }
    }, 30000); // 每 30 秒发送一次 ping 消息
  }

  // 停止发送 ping 消息
  private stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval); // 停止 ping 定时器
      this.pingInterval = null;
    }
  }

  public send(data: object): boolean {
    if (this.socket.readyState === WebSocket.OPEN) {
      const jsonData = JSON.stringify(data);
      this.socket.send(jsonData);
      return true;
    } else {
      console.error(
        `WebSocket at ${this.url} is not open. Storing message to send after reconnect.`
      );
      this.pendingMessages.push({ data });
      return false;
    }
  }

  private flushPendingMessages() {
    const messages = [...this.pendingMessages];
    this.pendingMessages = [];

    messages.forEach(({ data }) => {
      this.send(data);
    });
  }

  public close() {
    this.socket.close();
    this.stopPing(); // 停止心跳
  }
}
