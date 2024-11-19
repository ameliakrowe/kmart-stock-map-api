import { getNearestLocations } from "./getNearestLocations";
import { Coord } from "./types/Coord";
import { NearestLocation } from "./types/NearestLocation";
import { SearchCoord } from "./types/SearchCoord";
import { BinarySearchResult } from "./types/BinarySearchResult";
import { getDistance } from "geolib";
import { COORD_LIMITS } from "./utils/constants";
import { delay } from "./utils/utils";

async function binarySearchFromCoords(
  coord: Coord
): Promise<BinarySearchResult> {
  let min = 0;
  let max = 1000;
  let counter = 0;

  let result: NearestLocation[] = [];

  let lastSearchFailed = false;

  while (max - min > 10) {
    const guess = Math.floor((max - min) / 2 + min);
    try {
      const nearestLocationsResponse = await getNearestLocations(
        coord.lat.toString(),
        coord.lon.toString(),
        guess.toString()
      );
      counter += 1;
      const nearestLocations = nearestLocationsResponse.nearestLocations;
      lastSearchFailed = false;
      if (nearestLocationsResponse.nearestLocations.length < 10) {
        result = nearestLocations;
        min = guess;
      } else {
        max = guess;
      }
    } catch (err) {
      if (!lastSearchFailed) {
        console.error(
          "Probable rate limit hit on Kmart API. Trying again in 10 seconds"
        );
        lastSearchFailed = true;
        await delay(10000);
      } else {
        console.error(
          `Unexpected error fetching locations from Kmart API for lat ${
            Math.round(coord.lat * 10) / 10
          } lon ${
            Math.round(coord.lon * 10) / 10
          } at search distance ${guess}: ${err.message}`
        );
        throw new Error("Could not fetch locations");
      }
    }
  }
  return {
    locations: result,
    radiusToExcludeFromSearch: min < 9 ? 0 : min - 9,
    numberOfCallsMade: counter,
  };
}

export function excludeSearchCoordsWithinRadius(
  coords: SearchCoord[],
  centerCoord: Coord,
  radius: number
): SearchCoord[] {
  coords.forEach((coord: SearchCoord) => {
    const kmFromCenter =
      getDistance(
        { latitude: centerCoord.lat, longitude: centerCoord.lon },
        { latitude: coord.coord.lat, longitude: coord.coord.lon }
      ) / 1000;
    if (kmFromCenter <= radius) {
      coord.needToSearch = false;
    }
  });
  return coords;
}

export function getNumberOfLocationsToSearch(coords: SearchCoord[]): number {
  return coords.filter((coord) => coord.needToSearch).length;
}

export async function getAllLocations() {
  let counter = 0;
  const startTime = Date.now();

  let searchCoords: SearchCoord[] = [];
  const locations: NearestLocation[] = [];

  const currentSearchCoord = {
    lat: COORD_LIMITS.north,
    lon: COORD_LIMITS.west,
  };

  while (currentSearchCoord.lat >= COORD_LIMITS.south) {
    searchCoords.push({
      coord: {
        lat: currentSearchCoord.lat,
        lon: currentSearchCoord.lon,
      },
      needToSearch: true,
    });
    currentSearchCoord.lon += 0.1;
    if (currentSearchCoord.lon > COORD_LIMITS.east) {
      currentSearchCoord.lon = COORD_LIMITS.west;
      currentSearchCoord.lat -= 0.1;
    }
  }

  console.log(
    "%d locations left to search",
    getNumberOfLocationsToSearch(searchCoords)
  );

  while (getNumberOfLocationsToSearch(searchCoords) > 0) {
    const coordToSearch = searchCoords.filter((coord) => coord.needToSearch)[0];
    console.log(
      "Searching for lat: %d lon: %d",
      Math.round(coordToSearch.coord.lat * 10) / 10,
      Math.round(coordToSearch.coord.lon * 10) / 10
    );

    try {
      const result = await binarySearchFromCoords(coordToSearch.coord);
      console.log("%d locations found", result.locations.length);
      console.log("excluding %d radius", result.radiusToExcludeFromSearch);

      searchCoords = excludeSearchCoordsWithinRadius(
        searchCoords,
        coordToSearch.coord,
        result.radiusToExcludeFromSearch
      );
      console.log(getNumberOfLocationsToSearch(searchCoords));
      counter += result.numberOfCallsMade;

      result.locations.forEach((newLocation) => {
        const matchingLocations = locations.filter(
          (existingLocation) =>
            existingLocation.locationId === newLocation.locationId
        );
        if (matchingLocations.length === 0) {
          locations.push(newLocation);
        }
      });
    } catch (err) {
      throw err;
    }
  }

  const finalResult = {
    locations: locations,
  };

  const fs = require("fs");

  fs.writeFile(
    "locations.json",
    JSON.stringify(finalResult, null, 4),
    (err: any) => {
      if (err) {
        console.error(err);
      }
    }
  );

  const endTime = Date.now();
  return {
    locations,
    numberOfLocations: locations.length,
    numberOfCalls: counter,
    duration: endTime - startTime,
  };
}
