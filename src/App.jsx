import React, { useState, useEffect } from "react";
import { CssBaseline, Grid } from "@material-ui/core";

import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";
import { getPlacesData, getWeatherData } from "./api";

const App = () => {
  const [places, setPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [childClicked, setChildClicked] = useState(null);

  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [bounds, setBounds] = useState({ ne: 0, sw: 0 });

  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState("");

  const displayedPlaces = rating
    ? places.filter((place) => Number(place.rating) > Number(rating))
    : places;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  useEffect(() => {
    if (!bounds.sw || !bounds.ne) {
      return undefined;
    }

    let cancelled = false;

    getWeatherData(coordinates.lat, coordinates.lng).then((data) => {
      if (!cancelled) setWeatherData(data);
    });

    getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
      if (cancelled) return;
      setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [type, bounds, coordinates.lat, coordinates.lng]);

  useEffect(() => {
    if (!bounds.sw || !bounds.ne) {
      return undefined;
    }

    const frame = requestAnimationFrame(() => setIsLoading(true));
    return () => cancelAnimationFrame(frame);
  }, [type, bounds]);

  return (
    <>
      <CssBaseline />
      <Header />
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            places={displayedPlaces}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={displayedPlaces}
            setChildClicked={setChildClicked}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
