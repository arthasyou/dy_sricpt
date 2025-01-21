import { userInfo } from "os";
import { Request, Route, Page } from "playwright";
import { getResponse } from "../interceptorResponse";

export async function handleQrcode(page: Page, route: Route, request: Request) {
  console.log("Example request:", request.url());
  //   console.log("处理 API 请求:", request.url());
  // 这里可以添加具体的处理逻辑
  await route.continue();
  // await page.click("text=More information");
}

async function getQrcode(route: Route): Promise<QrcodeData | null> {
  const s = await getResponse(route);
  return parseQrcode(s);
}

function parseQrcode(s: string): QrcodeData | null {
  try {
    const response: QrcodeData = JSON.parse(s);
    return response; // 返回解析后的数据
  } catch (error) {
    console.error("解析 JSON 失败:", error);
    return null; // 解析失败时返回 null
  }
}

type QrcodeData =
  | {
      error_code: 2046;
      description: string;
      userInfo: UserInfo;
      verify_ways: VerifyWay[];
    } // 验证返回
  | { error_code: 0; status: number; message: string }; // 成功返回

interface VerifyWay {
  verify_way: string;
  act_type?: string;
  mobile?: string;
  channel_mobile?: string;
  sms_content?: string;
}

interface UserInfo {
  nickname: string;
}
