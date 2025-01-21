import { Request, Route, Page } from "playwright";

export async function handleExample(
  page: Page,
  route: Route,
  request: Request
) {
  console.log("Example request:", request.url());
  //   console.log("处理 API 请求:", request.url());
  // 这里可以添加具体的处理逻辑
  await route.continue();
  // await page.click("text=More information");
}
