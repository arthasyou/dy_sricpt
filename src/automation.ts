import { Page } from "playwright";

export async function runAutomation(page: Page) {
  console.log("自动化脚本开始...");
  await page.goto("https://example.com");
  await page.click("text=More information");
  console.log("自动化脚本完成！");
}
