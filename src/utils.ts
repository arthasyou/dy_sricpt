import { Page } from "playwright";

export async function takeScreenshot(
  page: Page,
  path: string = "screenshot.png"
) {
  await page.screenshot({ path });
}
