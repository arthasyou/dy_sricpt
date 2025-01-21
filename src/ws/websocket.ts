export class WebSocketService {
  private socket!: WebSocket;
  private reconnectAttempts: number = 0;
  private static maxReconnectAttempts: number = 5;
  private static reconnectInterval: number = 3000;
  private pendingMessages: { data: object }[] = []; // 暂存待发送的消息队列
  private url: string;

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
    };

    this.socket.onmessage = (event) => {
      const message = event.data;
      try {
        const jsonData = JSON.parse(message); // 解析 JSON 字符串
        // 假设 `jsonData` 是解析后的 JSON 对象
        console.log("Received message:", jsonData);

        // 你可以在这里处理解析后的 `jsonData`
        // 例如调用 protoService 或其他逻辑
        // const decodedMessage = protoService.decode(jsonData);
        // dataManager.updateMessage(decodedMessage.cmd, decodedMessage.data);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };

    this.socket.onclose = () => {
      console.log(`Disconnected from WebSocket server at ${this.url}`);
      this.handleReconnect();
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.handleReconnect();
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

  public send(data: object): boolean {
    if (this.socket.readyState === WebSocket.OPEN) {
      const jsonData = JSON.stringify(data); // 将数据转换为 JSON 字符串
      this.socket.send(jsonData); // 发送 JSON 字符串
      return true;
    } else {
      console.error(
        `WebSocket at ${this.url} is not open. Storing message to send after reconnect.`
      );
      this.pendingMessages.push({ data }); // 暂存消息（不再有 cmd 参数）
      return false;
    }
  }

  // 在重新连接后发送所有暂存的消息
  private flushPendingMessages() {
    const messages = [...this.pendingMessages]; // 复制当前队列
    this.pendingMessages = []; // 清空原队列

    messages.forEach(({ data }) => {
      this.send(data);
    });
  }

  public close() {
    this.socket.close();
  }
}
