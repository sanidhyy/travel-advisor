import { useEffect, useRef, useState, type ReactNode } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import { Paper, Typography, useMediaQuery } from "@material-ui/core";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import Rating from "@material-ui/lab/Rating";

import useStyles from "./styles";
import "leaflet/dist/leaflet.css";
import type {
  Coordinates,
  MapBounds,
  Place,
  WeatherData,
} from "../../types";

type MapProps = {
  setCoordinates: (coordinates: Coordinates) => void;
  setBounds: (bounds: MapBounds) => void;
  coordinates: Coordinates;
  places: Place[];
  setChildClicked: (index: number) => void;
  weatherData?: WeatherData;
};

const reportView = (
  map: LeafletMap,
  setCoordinates: (coordinates: Coordinates) => void,
  setBounds: (bounds: MapBounds) => void
) => {
  const center = map.getCenter();
  const bounds = map.getBounds();
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();

  setCoordinates({ lat: center.lat, lng: center.lng });
  setBounds({
    ne: { lat: ne.lat, lng: ne.lng },
    sw: { lat: sw.lat, lng: sw.lng },
  });
};

const MapEvents = ({
  setCoordinates,
  setBounds,
}: Pick<MapProps, "setCoordinates" | "setBounds">) => {
  const map = useMapEvents({
    moveend: () => reportView(map, setCoordinates, setBounds),
  });

  useEffect(() => {
    map.invalidateSize();
    const center = map.getCenter();
    if (center.lat === 0 && center.lng === 0) return;
    reportView(map, setCoordinates, setBounds);
  }, [map, setCoordinates, setBounds]);

  return null;
};

const Recenter = ({ coordinates }: { coordinates: Coordinates }) => {
  const map = useMap();
  const didCenter = useRef(false);

  useEffect(() => {
    if (
      !didCenter.current &&
      (coordinates.lat !== 0 || coordinates.lng !== 0)
    ) {
      map.setView([coordinates.lat, coordinates.lng], 14, { animate: false });
      didCenter.current = true;
    }
  }, [coordinates, map]);

  return null;
};

const OverlayMarker = ({
  lat,
  lng,
  className,
  onClick,
  children,
}: {
  lat: number;
  lng: number;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) => {
  const map = useMap();
  const [pos, setPos] = useState(() =>
    map.latLngToContainerPoint([lat, lng])
  );

  useEffect(() => {
    const update = () => setPos(map.latLngToContainerPoint([lat, lng]));
    map.on("move zoom viewreset", update);
    update();
    return () => {
      map.off("move zoom viewreset", update);
    };
  }, [map, lat, lng]);

  return (
    <div
      className={className}
      style={{ left: pos.x, top: pos.y }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const Map = ({
  setCoordinates,
  setBounds,
  coordinates,
  places,
  setChildClicked,
  weatherData,
}: MapProps) => {
  const classes = useStyles();
  const isDesktop = useMediaQuery("(min-width: 600px)");

  return (
    <div className={classes.mapContainer}>
      <MapContainer
        center={[coordinates.lat || 0, coordinates.lng || 0]}
        zoom={14}
        zoomControl
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter coordinates={coordinates} />
        <MapEvents setCoordinates={setCoordinates} setBounds={setBounds} />

        <div className={classes.overlayPane}>
          {places.map((place, i) => {
            const lat = Number(place.latitude);
            const lng = Number(place.longitude);
            if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

            return (
              <OverlayMarker
                key={`${place.name ?? "place"}-${i}`}
                lat={lat}
                lng={lng}
                className={classes.markerContainer}
                onClick={() => setChildClicked(i)}
              >
                {!isDesktop ? (
                  <LocationOnOutlinedIcon color="primary" fontSize="large" />
                ) : (
                  <Paper elevation={3} className={classes.paper}>
                    <Typography variant="subtitle2" gutterBottom>
                      {place.name}
                    </Typography>
                    <img
                      src={
                        place.photo?.images?.large?.url ??
                        "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
                      }
                      alt={place.name}
                      className={classes.pointer}
                    />
                    <Rating
                      size="small"
                      value={Number(place.rating)}
                      readOnly
                    />
                  </Paper>
                )}
              </OverlayMarker>
            );
          })}

          {weatherData?.location && weatherData.current?.condition?.icon && (
            <OverlayMarker
              lat={weatherData.location.lat}
              lng={weatherData.location.lon}
              className={classes.markerContainer}
            >
              <img
                height={100}
                src={`https:${weatherData.current.condition.icon}`}
                alt={weatherData.current.condition.text}
              />
            </OverlayMarker>
          )}
        </div>
      </MapContainer>
    </div>
  );
};

export default Map;
