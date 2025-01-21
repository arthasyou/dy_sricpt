import { parentPort } from "worker_threads";
import { WebSocketService } from "./ws/websocket";

export function startWS(workerId: number) {
  const ws = new WebSocketService("ws://localhost:13785");
  parentPort?.postMessage(`工作线程 ${workerId} 已完成任务`);
}

parentPort?.on("message", (msg: { workerId: number }) => {
  console.log(`工作线程 ${msg.workerId} 开始执行`);
  startWS(msg.workerId);
});
