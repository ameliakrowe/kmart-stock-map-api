import axios from "axios";
import { KMART_API_URL, NEAREST_LOCATIONS_API_QUERY } from "./utils/constants";

export async function getNearestLocations(
  lat: number,
  lon: number,
  distance: number
) {
  const variables = {
    lat: lat.toString(),
    lon: lon.toString(),
    distance: distance.toString() + "km",
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
