import { Route } from "playwright";

export async function getResponse(route: Route): Promise<string> {
  const response = await route.fetch();
  let body = await response.text();
  return body;
}
