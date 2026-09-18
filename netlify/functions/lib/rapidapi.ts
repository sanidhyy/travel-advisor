export const PLACE_TYPES = ["restaurants", "hotels", "attractions"] as const;

export type PlaceType = (typeof PLACE_TYPES)[number];

export const isPlaceType = (value: string): value is PlaceType =>
  PLACE_TYPES.some((type) => type === value);

export const parseFiniteNumber = (value: string | null): number | undefined => {
  if (value == null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const loadLocalEnvFile = (fileName: string): void => {
  try {
    process.loadEnvFile(fileName);
  } catch {
    // File may not exist locally or in production.
  }
};

loadLocalEnvFile(".env.local");
loadLocalEnvFile(".env");

export const getRapidApiKey = (): string | undefined => {
  const key = process.env.RAPID_API_KEY;
  return key ? key : undefined;
};

export const jsonError = (message: string, status: number): Response =>
  Response.json({ error: message }, { status });

export const rapidApiFetch = async (
  url: URL,
  host: string
): Promise<Response> => {
  const key = getRapidApiKey();
  if (!key) {
    return jsonError("Server is missing RAPID_API_KEY", 500);
  }

  const response = await fetch(url, {
    headers: {
      "X-RapidAPI-Key": key,
      "X-RapidAPI-Host": host,
    },
  });

  if (!response.ok) {
    return jsonError("Upstream request failed", 502);
  }

  const body: unknown = await response.json();
  return Response.json(body);
};
