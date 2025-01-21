import { parentPort } from "worker_threads";
import { chromium } from "playwright";
import { startInterceptor } from "./interceptor";
import { runAutomation } from "./automation";
import { startWS } from "./main_ws";

async function startBrowser(workerId: number): Promise<void> {
  startWS();

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // 启动抓包拦截的异步函数
  startInterceptor(page);

  // 运行自动化操作
  await runAutomation(page);

  // 可根据需要在这里关闭浏览器，或让它保持打开状态
  // await browser.close();

  // 返回任务结果给主线程
  parentPort?.postMessage(`工作线程 ${workerId} 已完成任务`);
}

// 接收主线程的消息并启动浏览器
parentPort?.on("message", (msg: { workerId: number }) => {
  console.log(`工作线程 ${msg.workerId} 开始执行`);
  startBrowser(msg.workerId);
});
