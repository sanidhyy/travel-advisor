import axios from "axios";
import type { Coordinates, Place, PlaceType, WeatherData } from "../types";

export const getPlacesData = async (
  type: PlaceType,
  sw: Coordinates,
  ne: Coordinates
): Promise<Place[] | undefined> => {
  try {
    const response = await axios.get("/api/places", {
      params: {
        type,
        bl_latitude: sw.lat,
        tr_latitude: ne.lat,
        bl_longitude: sw.lng,
        tr_longitude: ne.lng,
      },
    });

    const payload = response.data as { data?: Place[] };
    return payload.data;
  } catch (err) {
    console.log(err);
  }
};

export const getWeatherData = async (
  lat: number,
  lng: number
): Promise<WeatherData | undefined> => {
  if (lat === 0 && lng === 0) return;

  try {
    const response = await axios.get("/api/weather", {
      params: { lat, lng },
    });

    return response.data as WeatherData;
  } catch (err) {
    console.log(err);
  }
};
