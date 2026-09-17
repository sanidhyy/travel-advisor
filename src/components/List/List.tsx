import type { Dispatch, SetStateAction } from "react";
import {
  CircularProgress,
  Grid,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import PlaceDetails from "../PlaceDetails/PlaceDetails";
import type { Place, PlaceType } from "../../types";

type ListProps = {
  places: Place[];
  childClicked: number | null;
  isLoading: boolean;
  type: PlaceType;
  setType: Dispatch<SetStateAction<PlaceType>>;
  rating: number | "";
  setRating: Dispatch<SetStateAction<number | "">>;
};

const List = ({
  places,
  childClicked,
  isLoading,
  type,
  setType,
  rating,
  setRating,
}: ListProps) => {
  return (
    <div style={{ padding: 25 }}>
      <Typography variant="h4">
        Restaurants, Hotels & Attractions around you
      </Typography>
      {isLoading ? (
        <div
          style={{
            height: 600,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size="5rem" />
        </div>
      ) : (
        <>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120, mb: "30px" }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              onChange={(e: SelectChangeEvent<PlaceType>) =>
                setType(e.target.value as PlaceType)
              }
            >
              <MenuItem value="restaurants">Restaurants</MenuItem>
              <MenuItem value="hotels">Hotels</MenuItem>
              <MenuItem value="attractions">Attractions</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="standard" sx={{ m: 1, minWidth: 120, mb: "30px" }}>
            <InputLabel>Rating</InputLabel>
            <Select
              value={rating}
              onChange={(e: SelectChangeEvent<number | "">) =>
                setRating(e.target.value as number | "")
              }
            >
              <MenuItem value={0}>All</MenuItem>
              <MenuItem value={3}>Above 3.0</MenuItem>
              <MenuItem value={4}>Above 4.0</MenuItem>
              <MenuItem value={4.5}>Above 4.5</MenuItem>
            </Select>
          </FormControl>

          <Grid container spacing={3} sx={{ height: "75vh", overflow: "auto" }}>
            {places.map((place, i) => (
              <Grid key={place.name ?? i} size={12}>
                <PlaceDetails
                  place={place}
                  selected={Number(childClicked) === i}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
};

export default List;
