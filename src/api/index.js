import axios from "axios";

export const getPlacesData = async (type, sw, ne) => {
  try {
    const options = {
      params: {
        bl_latitude: sw.lat,
        tr_latitude: ne.lat,
        bl_longitude: sw.lng,
        tr_longitude: ne.lng,
      },
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
        "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
      },
    };
    const {
      data: { data },
    } = await axios.get(
      `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`,
      options
    );

    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getWeatherData = async (lat, lng) => {
  const options = {
    params: { lon: lng, lat: lat },
    headers: {
      "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      "X-RapidAPI-Host": "community-open-weather-map.p.rapidapi.com",
    },
  };
  try {
    const { data } = await axios.get(
      "https://community-open-weather-map.p.rapidapi.com/climate/month",
      options
    );

    return data;
  } catch (err) {
    console.log(err);
  }
};
