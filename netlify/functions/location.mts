import type { Config, Context } from "@netlify/functions";

const FALLBACK = { lat: 51.5074, lng: -0.1278 };

const isPrivateIp = (ip: string): boolean => {
  const value = ip.trim().toLowerCase();
  return (
    value === "127.0.0.1" ||
    value === "::1" ||
    value === "::ffff:127.0.0.1" ||
    value.startsWith("10.") ||
    value.startsWith("192.168.") ||
    value.startsWith("127.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(value) ||
    value.startsWith("fc") ||
    value.startsWith("fd")
  );
};

const parseLatLng = (
  lat: unknown,
  lng: unknown
): { lat: number; lng: number } | undefined => {
  if (typeof lat !== "number" || typeof lng !== "number") return undefined;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;
  return { lat, lng };
};

const lookupIpWho = async (
  ip?: string
): Promise<{ lat: number; lng: number } | undefined> => {
  const url = ip
    ? `https://ipwho.is/${encodeURIComponent(ip)}`
    : "https://ipwho.is/";
  const response = await fetch(url);

  if (!response.ok) return undefined;

  const body: unknown = await response.json();
  if (!body || typeof body !== "object") return undefined;

  const record = body as {
    success?: boolean;
    latitude?: number;
    longitude?: number;
  };
  if (record.success === false) return undefined;

  return parseLatLng(record.latitude, record.longitude);
};

export default async (
  _req: Request,
  context: Context
): Promise<Response> => {
  const fromNetlify = parseLatLng(
    context.geo.latitude,
    context.geo.longitude
  );
  if (fromNetlify) {
    return Response.json(fromNetlify);
  }

  try {
    const fromClientIp =
      context.ip && !isPrivateIp(context.ip)
        ? await lookupIpWho(context.ip)
        : undefined;
    const fromPublicIp = fromClientIp ?? (await lookupIpWho());
    if (fromPublicIp) {
      return Response.json(fromPublicIp);
    }
  } catch {
    // Fall through to a city-level default so the map still loads.
  }

  return Response.json(FALLBACK);
};

export const config: Config = {
  path: "/api/location",
  method: "GET",
};
