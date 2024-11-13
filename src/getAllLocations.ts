import { getNearestLocations } from "./getNearestLocations";
import { Coord } from "./types/Coord";
import { NearestLocation } from "./types/NearestLocation";
import { SearchCoord } from "./types/SearchCoord";
import { BinarySearchResult } from "./types/BinarySearchResult";
import { getDistance } from "geolib";

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function binarySearchFromCoords(
  coord: Coord
): Promise<BinarySearchResult> {
  let min = 0;
  let max = 1000;
  let counter = 0;

  let result: NearestLocation[] = [];

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
      if (nearestLocationsResponse.nearestLocations.length < 10) {
        result = nearestLocations;
        min = guess;
      } else {
        max = guess;
      }
    } catch {
      console.log(
        "Probable rate limit hit on Kmart API. Trying again in 10 seconds"
      );
      await delay(10000);
    }
  }
  return {
    locations: result,
    radiusToExcludeFromSearch: min < 9 ? 9 : min,
    numberOfCallsMade: counter,
  };
}

function excludeCoordsToSearch(
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
    if (kmFromCenter <= radius - 9) {
      coord.needToSearch = false;
    }
  });
  return coords;
}

function getNumberOfLocationsToSearch(coords: SearchCoord[]): number {
  return coords.filter((coord) => coord.needToSearch).length;
}

export async function getAllLocations() {
  let counter = 0;
  const startTime = Date.now();

  const coordLimits = {
    north: -10,
    south: -44,
    west: 112,
    east: 154,
  };

  let searchCoords: SearchCoord[] = [];
  const locations: NearestLocation[] = [];

  const currentSearchCoord = {
    lat: coordLimits.north,
    lon: coordLimits.west,
  };

  while (currentSearchCoord.lat >= coordLimits.south) {
    searchCoords.push({
      coord: {
        lat: currentSearchCoord.lat,
        lon: currentSearchCoord.lon,
      },
      needToSearch: true,
    });
    currentSearchCoord.lon += 0.1;
    if (currentSearchCoord.lon > coordLimits.east) {
      currentSearchCoord.lon = coordLimits.west;
      currentSearchCoord.lat -= 0.1;
    }
  }

  console.log(
    "&d locations left to search",
    getNumberOfLocationsToSearch(searchCoords)
  );

  while (getNumberOfLocationsToSearch(searchCoords) > 0) {
    const coordToSearch = searchCoords.filter((coord) => coord.needToSearch)[0];
    console.log(
      "Searching for lat: %d lon: %d",
      Math.round(coordToSearch.coord.lat * 10) / 10,
      Math.round(coordToSearch.coord.lon * 10) / 10
    );

    const result = await binarySearchFromCoords(coordToSearch.coord);
    console.log("%d locations found", result.locations.length);
    console.log("excluding %d radius", result.radiusToExcludeFromSearch - 9);

    searchCoords = excludeCoordsToSearch(
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
