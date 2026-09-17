import axios from "axios";

// Get Places Data
export const getPlacesData = async (type, sw, ne) => {
  try {
    // params & headers
    const options = {
      params: {
        bl_latitude: sw.lat,
        tr_latitude: ne.lat,
        bl_longitude: sw.lng,
        tr_longitude: ne.lng,
      },
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY, // Your Rapid API Key
        "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
      },
    };

    // fetch places list
    const {
      data: { data },
    } = await axios.get(
      `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`,
      options
    );

    return data;
  } catch (err) {
    // Error in fetching data
    console.log(err);
  }
};

// Get Weather Data
export const getWeatherData = async (lat, lng) => {
  if (lat == null || lng == null || (lat === 0 && lng === 0)) return;

  try {
    // params & headers
    const options = {
      params: { q: `${lat},${lng}` },
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY, // Your Rapid API Key
        "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
      },
    };

    // fetch weather for a place
    const { data } = await axios.get(
      "https://weatherapi-com.p.rapidapi.com/current.json",
      options
    );

    return data;
  } catch (err) {
    // Error in fetching data
    console.log(err);
  }
};
