import type { Config } from "@netlify/functions";
import {
  isPlaceType,
  jsonError,
  parseFiniteNumber,
  rapidApiFetch,
} from "./lib/rapidapi.ts";

export default async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const blLatitude = parseFiniteNumber(url.searchParams.get("bl_latitude"));
  const trLatitude = parseFiniteNumber(url.searchParams.get("tr_latitude"));
  const blLongitude = parseFiniteNumber(url.searchParams.get("bl_longitude"));
  const trLongitude = parseFiniteNumber(url.searchParams.get("tr_longitude"));

  if (!type || !isPlaceType(type)) {
    return jsonError("Invalid place type", 400);
  }

  if (
    blLatitude === undefined ||
    trLatitude === undefined ||
    blLongitude === undefined ||
    trLongitude === undefined
  ) {
    return jsonError("Invalid map bounds", 400);
  }

  const rapidUrl = new URL(
    `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`
  );
  rapidUrl.searchParams.set("bl_latitude", String(blLatitude));
  rapidUrl.searchParams.set("tr_latitude", String(trLatitude));
  rapidUrl.searchParams.set("bl_longitude", String(blLongitude));
  rapidUrl.searchParams.set("tr_longitude", String(trLongitude));

  return rapidApiFetch(rapidUrl, "travel-advisor.p.rapidapi.com");
};

export const config: Config = {
  path: "/api/places",
  method: "GET",
};
