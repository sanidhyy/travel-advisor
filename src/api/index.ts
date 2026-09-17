/// <reference types="node" />
import axios from "axios";
import type { Coordinates, Place, PlaceType, WeatherData } from "../types";

export const getPlacesData = async (
  type: PlaceType,
  sw: Coordinates,
  ne: Coordinates
): Promise<Place[] | undefined> => {
  try {
    const response = await axios.get(
      `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`,
      {
        params: {
          bl_latitude: sw.lat,
          tr_latitude: ne.lat,
          bl_longitude: sw.lng,
          tr_longitude: ne.lng,
        },
        headers: {
          "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY ?? "",
          "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
        },
      }
    );

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
    const response = await axios.get(
      "https://weatherapi-com.p.rapidapi.com/current.json",
      {
        params: { q: `${lat},${lng}` },
        headers: {
          "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY ?? "",
          "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
        },
      }
    );

    return response.data as WeatherData;
  } catch (err) {
    console.log(err);
  }
};
