import { Page, Route, Request } from "playwright";
import { handleExample } from "./handlers/handleExample";

// 路由配置，按 URL 选择对应的处理函数
const routes = [{ pattern: /example/, handler: handleExample }];

// 设置路由拦截器
export async function setupRoutes(page: Page) {
  await page.route("**/*", async (route, request) => {
    // console.log("Intercepting request:", request.url());
    const requestUrl = request.url();
    let matched = false;

    // 遍历所有路由，匹配请求的 URL
    for (const routeConfig of routes) {
      if (routeConfig.pattern.test(requestUrl)) {
        console.log(`匹配到路由: ${requestUrl}`);
        await routeConfig.handler(page, route, request); // 调用对应的处理函数
        matched = true;
        break;
      }
    }

    if (!matched) {
      await route.continue(); // 没有匹配的路由，继续请求
    }
  });
}
