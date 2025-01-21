import { Page } from "playwright";
import { setupRoutes } from "./routeHandler"; // 引入路由处理函数

export async function startInterceptor(page: Page) {
  // 设置路由拦截器
  await setupRoutes(page);

  console.log("网络拦截器启动...");
}
