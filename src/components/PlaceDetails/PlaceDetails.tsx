import { useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Rating,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import type { Place } from "../../types";

type PlaceDetailsProps = {
  place: Place;
  selected: boolean;
};

const PlaceDetails = ({ place, selected }: PlaceDetailsProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selected) return;
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selected]);

  return (
    <Card ref={cardRef} elevation={6}>
      <CardMedia
        sx={{ height: 350 }}
        image={
          place.photo?.images?.large?.url ??
          "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
        }
        title={place.name || "N/A"}
      />

      <CardContent>
        <Typography gutterBottom variant="h5">
          {place.name || "N/A"}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Rating value={Number(place.rating)} readOnly />
          <Typography gutterBottom variant="subtitle1">
            out of {place.num_reviews} reviews
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle1">Price</Typography>
          <Typography gutterBottom variant="subtitle1">
            {place.price_level || "N/A"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle1">Ranking</Typography>
          <Typography gutterBottom variant="subtitle1">
            {place.ranking || "N/A"}
          </Typography>
        </Box>

        {place.awards?.map((award) => (
          <Box
            sx={{ display: "flex", justifyContent: "space-between" }}
            key={award.display_name}
          >
            <img src={award.images.small} alt={award.display_name} />
            <Typography variant="subtitle2" color="text.secondary">
              {award.display_name}
            </Typography>
          </Box>
        ))}

        {place.cuisine?.map(({ name }) => (
          <Chip
            key={name}
            size="small"
            label={name}
            sx={{ margin: "5px 5px 5px 0" }}
          />
        ))}

        {place.address && (
          <Typography
            gutterBottom
            variant="subtitle2"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: "10px",
            }}
          >
            <LocationOnIcon /> {place.address}
          </Typography>
        )}

        {place.phone && (
          <Typography
            gutterBottom
            variant="subtitle2"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <PhoneIcon /> {place.phone}
          </Typography>
        )}

        <CardActions>
          {place.web_url ? (
            <Button
              size="small"
              color="primary"
              onClick={() => window.open(place.web_url, "_blank")}
            >
              Trip Advisor
            </Button>
          ) : null}

          {place.website ? (
            <Button
              size="small"
              color="primary"
              onClick={() => window.open(place.website, "_blank")}
            >
              Website
            </Button>
          ) : null}
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default PlaceDetails;
