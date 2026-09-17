export type Coordinates = {
  lat: number;
  lng: number;
};

export type MapBounds = {
  ne: Coordinates;
  sw: Coordinates;
};

export type PlaceType = "restaurants" | "hotels" | "attractions";

export type PlaceAward = {
  display_name: string;
  images: {
    small: string;
  };
};

export type Place = {
  name?: string;
  rating?: string | number;
  num_reviews?: string | number;
  latitude?: string | number;
  longitude?: string | number;
  price_level?: string;
  ranking?: string;
  address?: string;
  phone?: string;
  web_url?: string;
  website?: string;
  photo?: {
    images?: {
      large?: {
        url?: string;
      };
    };
  };
  awards?: PlaceAward[];
  cuisine?: { name: string }[];
};

export type WeatherData = {
  location: {
    lat: number;
    lon: number;
  };
  current: {
    condition: {
      icon: string;
      text: string;
    };
  };
};
