import { Worker as ThreadWorker } from "worker_threads";
import * as path from "path";
import { cpus } from "os";

// 启动多个工作线程，每个线程启动一个浏览器实例
const numWorkers = cpus().length; // 获取 CPU 核心数

for (let i = 0; i < numWorkers; i++) {
  const worker = new ThreadWorker(path.join(__dirname, "ws_worker.ts"));
  // const worker = new ThreadWorker(path.join(__dirname, "worker.ts")); // 引入工作线程文件

  worker.on("message", (msg: any) => {
    console.log(`工作线程 ${i} 完成:`, msg);
  });

  worker.on("error", (err: Error) => {
    console.error("工作线程出错:", err);
  });

  worker.on("exit", (code: number) => {
    console.log(`工作线程 ${i} 退出，退出码: ${code}`);
  });

  // 向工作线程发送启动浏览器的消息
  worker.postMessage({ workerId: i });
}
