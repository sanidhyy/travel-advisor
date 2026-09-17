import { useEffect, useRef, useState, type ReactNode } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import { Paper, Typography, useMediaQuery, Rating } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

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
    reportView(map, setCoordinates, setBounds);
  }, [map, setCoordinates, setBounds]);

  return null;
};

const Recenter = ({ coordinates }: { coordinates: Coordinates }) => {
  const map = useMap();
  const didCenter = useRef(false);

  useEffect(() => {
    if (didCenter.current) return;
    map.setView([coordinates.lat, coordinates.lng], 14, { animate: false });
    didCenter.current = true;
  }, [coordinates, map]);

  return null;
};

const OverlayMarker = ({
  lat,
  lng,
  onClick,
  children,
}: {
  lat: number;
  lng: number;
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
      onClick={onClick}
      style={{
        position: "absolute",
        transform: "translate(-50%, -50%)",
        zIndex: 1,
        pointerEvents: "auto",
        left: pos.x,
        top: pos.y,
      }}
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
  const isDesktop = useMediaQuery("(min-width: 600px)");

  return (
    <div style={{ height: "85vh", width: "100%" }}>
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
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

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 600,
            pointerEvents: "none",
          }}
        >
          {places.map((place, i) => {
            const lat = Number(place.latitude);
            const lng = Number(place.longitude);
            if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

            return (
              <OverlayMarker
                key={`${place.name ?? "place"}-${i}`}
                lat={lat}
                lng={lng}
                onClick={() => setChildClicked(i)}
              >
                {!isDesktop ? (
                  <LocationOnOutlinedIcon color="primary" fontSize="large" />
                ) : (
                  <Paper
                    elevation={3}
                    sx={{
                      p: "10px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      width: "100px",
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      {place.name}
                    </Typography>
                    <img
                      src={
                        place.photo?.images?.large?.url ??
                        "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
                      }
                      alt={place.name}
                      style={{ cursor: "pointer" }}
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
