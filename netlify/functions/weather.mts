import type { Config } from "@netlify/functions";
import {
  jsonError,
  parseFiniteNumber,
  rapidApiFetch,
} from "./lib/rapidapi.ts";

export default async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const lat = parseFiniteNumber(url.searchParams.get("lat"));
  const lng = parseFiniteNumber(url.searchParams.get("lng"));

  if (lat === undefined || lng === undefined) {
    return jsonError("Invalid coordinates", 400);
  }

  const rapidUrl = new URL("https://weatherapi-com.p.rapidapi.com/current.json");
  rapidUrl.searchParams.set("q", `${lat},${lng}`);

  return rapidApiFetch(rapidUrl, "weatherapi-com.p.rapidapi.com");
};

export const config: Config = {
  path: "/api/weather",
  method: "GET",
};
