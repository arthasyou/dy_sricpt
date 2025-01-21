import { Page } from "playwright";
import { customEmitter } from "./customEvent";

export async function runAutomation(page: Page) {
  customEmitter.on("sms", (message: string) => {
    console.log("事件被触发:", message);
  });

  console.log("自动化脚本开始...");
  await page.goto("https://example.com");
  await page.click("text=More information");
  console.log("自动化脚本完成！");
}
