import axios from "axios";
import { KMART_API_URL, NEAREST_LOCATIONS_API_QUERY } from "./utils/constants";

export async function getNearestLocations(
  lat: string,
  lon: string,
  distance: string
) {
  const variables = {
    lat,
    lon,
    distance: distance + "km",
  };

  try {
    const response = await axios.post(
      KMART_API_URL,
      {
        query: NEAREST_LOCATIONS_API_QUERY,
        operationName: "getNearestLocations",
        variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data.nearestLocations
      ? response.data.data
      : {
          nearestLocations: [],
        };
  } catch (err) {
    throw err;
  }
}
