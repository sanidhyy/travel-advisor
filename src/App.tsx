import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";

import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";
import { getPlacesData, getWeatherData, getApproximateLocation } from "./api";
import type {
  Coordinates,
  MapBounds,
  Place,
  PlaceType,
  WeatherData,
} from "./types";

const App = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | undefined>();
  const [childClicked, setChildClicked] = useState<number | null>(null);

  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [bounds, setBounds] = useState<MapBounds | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [type, setType] = useState<PlaceType>("restaurants");
  const [rating, setRating] = useState<number | "">("");

  const displayedPlaces = rating
    ? places.filter((place) => Number(place.rating) > Number(rating))
    : places;

  useEffect(() => {
    let cancelled = false;

    getApproximateLocation().then((location) => {
      if (!cancelled) setCoordinates(location);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!coordinates || !bounds?.sw || !bounds?.ne) {
      return undefined;
    }

    let cancelled = false;

    getWeatherData(coordinates.lat, coordinates.lng).then((data) => {
      if (!cancelled) setWeatherData(data);
    });

    getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
      if (cancelled) return;
      setPlaces(
        data?.filter((place) => place.name && Number(place.num_reviews) > 0) ??
          []
      );
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [type, bounds, coordinates]);

  useEffect(() => {
    if (!bounds?.sw || !bounds?.ne) {
      return undefined;
    }

    const frame = requestAnimationFrame(() => setIsLoading(true));
    return () => cancelAnimationFrame(frame);
  }, [type, bounds]);

  return (
    <>
      <Header />
      <Grid container spacing={3} sx={{ width: "100%" }}>
        <Grid size={{ xs: 12, md: 4 }}>
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

        <Grid size={{ xs: 12, md: 8 }}>
          {coordinates ? (
            <Map
              setCoordinates={setCoordinates}
              setBounds={setBounds}
              coordinates={coordinates}
              places={displayedPlaces}
              setChildClicked={setChildClicked}
              weatherData={weatherData}
            />
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};

export default App;
