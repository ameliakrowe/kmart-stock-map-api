import axios from "axios";
import { ClickAndCollectVariables } from "./types/ClickAndCollectVariables";
import { SearchLocation } from "./types/SearchLocation";
import { ClickAndCollectResponseLocation } from "./types/ClickAndCollectResponseLocation";
import { FullLocation } from "./types/FullLocation";
import { InStoreResponseLocation } from "./types/InStoreResponseLocation";
import { NearestLocation } from "./types/NearestLocation";
import { getDistance } from "geolib";
import * as locationData from "../locations.json";
import {
  CLICK_AND_COLLECT_API_QUERY,
  IN_STORE_API_QUERY,
  KMART_API_URL,
} from "./utils/constants";
import { InStoreVariables } from "./types/InStoreVariables";
import { AxiosError } from "axios";

const allLocations = locationData.locations as NearestLocation[];

function getFullLocationsFromCnCResponseLocations(
  locations: ClickAndCollectResponseLocation[]
): FullLocation[] {
  const result: FullLocation[] = [];

  locations.forEach((location) => {
    const matchingLocations = allLocations.filter(
      (nearestLocation: NearestLocation) =>
        nearestLocation.locationId == location.location.locationId
    );
    const matchingLocation =
      matchingLocations.length > 0 ? matchingLocations[0] : null;
    const matchingFulfilmentLocations = allLocations.filter(
      (nearestLocation: NearestLocation) =>
        nearestLocation.locationId == location.fulfilment.locationId
    );
    const matchingFulfilmentLocation =
      matchingFulfilmentLocations.length > 0
        ? matchingFulfilmentLocations[0]
        : null;
    const locationResult =
      matchingLocation && matchingFulfilmentLocation
        ? {
            locationId: location.location.locationId,
            publicName: matchingLocation.publicName,
            lat: matchingLocation.latitude,
            lon: matchingLocation.longitude,
            isBuddyLocation: location.fulfilment.isBuddyLocation,
            fulfilmentLocationId: location.fulfilment.locationId,
            fulfilmentLocationName: matchingFulfilmentLocation.publicName,
            quantityAvailable: location.fulfilment.stock.available,
          }
        : undefined;

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    locationResult && result.push(locationResult);
  });
  return result;
}

function getLocationsWithinRadius(
  lat: string,
  lon: string,
  searchRadius: number
): NearestLocation[] {
  return allLocations.filter(
    (location: NearestLocation) =>
      getDistance(
        { latitude: location.latitude, longitude: location.longitude },
        { latitude: lat, longitude: lon }
      ) /
        1000 <
      searchRadius
  );
}

function generateClickAndCollectVariables(
  postcode: string,
  productSKU: string
): ClickAndCollectVariables {
  return {
    input: {
      country: "AU",
      postcode,
      products: [
        {
          keycode: productSKU,
          quantity: 1,
          isNationalInventory: false,
          isClickAndCollectOnly: false,
        },
      ],
      fulfilmentMethods: ["CLICK_AND_COLLECT"],
    },
  };
}

function generateInStoreVariables(
  postcode: string,
  productSKU: string
): InStoreVariables {
  return {
    input: {
      country: "AU",
      postcode,
      keycodes: [productSKU],
    },
  };
}

function addNewResultsToClickAndCollectSearchResults(
  oldResults: ClickAndCollectResponseLocation[],
  newResults: ClickAndCollectResponseLocation[],
  locationsToInclude: NearestLocation[]
): ClickAndCollectResponseLocation[] {
  newResults.forEach((newResult) => {
    const existingMatchingLocations = oldResults.filter(
      (existingResult) =>
        newResult.location.locationId === existingResult.location.locationId
    );
    if (
      existingMatchingLocations.length < 1 &&
      locationsToInclude
        .map((location) => location.locationId)
        .includes(newResult.location.locationId)
    ) {
      oldResults.push(newResult);
    }
  });
  return oldResults;
}

function addNewResultsToInStoreSearchResults(
  oldResults: InStoreResponseLocation[],
  newResults: InStoreResponseLocation[],
  locationsToInclude: NearestLocation[]
): InStoreResponseLocation[] {
  newResults.forEach((newResult) => {
    const existingMatchingLocations = oldResults.filter(
      (existingResult) => newResult.locationId === existingResult.locationId
    );
    if (
      existingMatchingLocations.length < 1 &&
      locationsToInclude
        .map((location) => location.locationId)
        .includes(newResult.locationId.toString())
    ) {
      oldResults.push(newResult);
    }
  });
  return oldResults;
}

export async function getProductAvailability(
  productSKU: string,
  lat: string,
  lon: string,
  searchRadius: number
) {
  const locationsWithinRadius = getLocationsWithinRadius(
    lat,
    lon,
    searchRadius
  );

  let locationsToSearchClickAndCollect: SearchLocation[] =
    locationsWithinRadius.map((location) => ({
      locationId: location.locationId,
      postcode: location.postcode,
      publicName: location.publicName,
    }));

  let locationsToSearchInStore: SearchLocation[] = locationsWithinRadius.map(
    (location) => ({
      locationId: location.locationId,
      postcode: location.postcode,
      publicName: location.publicName,
    })
  );

  let clickAndCollectSearchResults: ClickAndCollectResponseLocation[] = [];

  let inStoreSearchResults: InStoreResponseLocation[] = [];

  while (locationsToSearchInStore.length > 0) {
    try {
      const locationToSearch = locationsToSearchInStore[0];
      console.log(
        "searching in store for store %s: %s, %s",
        locationToSearch.locationId,
        locationToSearch.publicName,
        locationToSearch.postcode
      );
      const inStoreResponse = await axios.post(
        KMART_API_URL,
        {
          query: IN_STORE_API_QUERY,
          operationName: "getFindInStore",
          variables: generateInStoreVariables(
            locationToSearch.postcode,
            productSKU
          ),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (inStoreResponse.data.data.findInStoreQuery.length < 1) {
        throw new Error(
          "No product found for the specified SKU. Please check input and try again."
        );
      }

      const inStoreLocations = inStoreResponse.data.data.findInStoreQuery[0]
        .inventory as InStoreResponseLocation[];
      const locationIdsFound = inStoreLocations.map((location) =>
        location.locationId.toString()
      );
      locationsToSearchInStore = locationsToSearchInStore.filter(
        (location) =>
          !locationIdsFound.includes(location.locationId) &&
          location.locationId != locationToSearch.locationId
      );
      inStoreSearchResults = addNewResultsToInStoreSearchResults(
        inStoreSearchResults,
        inStoreLocations,
        locationsWithinRadius
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error getting product availability", error);
      throw new Error(axiosError.message);
    }
  }

  while (locationsToSearchClickAndCollect.length > 0) {
    try {
      const locationToSearch = locationsToSearchClickAndCollect[0];
      console.log(
        "searching c&c for store %s: %s, %s",
        locationToSearch.locationId,
        locationToSearch.publicName,
        locationToSearch.postcode
      );
      const clickAndCollectResponse = await axios.post(
        KMART_API_URL,
        {
          query: CLICK_AND_COLLECT_API_QUERY,
          operationName: "getProductAvailability",
          variables: generateClickAndCollectVariables(
            locationToSearch.postcode,
            productSKU
          ),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const clickAndCollectLocations = clickAndCollectResponse.data.data
        .getProductAvailability.availability.CLICK_AND_COLLECT[0]
        .locations as ClickAndCollectResponseLocation[];
      const locationIdsFound = clickAndCollectLocations.map(
        (location) => location.location.locationId
      );
      locationsToSearchClickAndCollect =
        locationsToSearchClickAndCollect.filter(
          (location) =>
            !locationIdsFound.includes(location.locationId) &&
            location.locationId !== locationToSearch.locationId
        );
      clickAndCollectSearchResults =
        addNewResultsToClickAndCollectSearchResults(
          clickAndCollectSearchResults,
          clickAndCollectLocations,
          locationsWithinRadius
        );
    } catch (error) {
      console.error("Error getting product availability", error);
      throw new Error("Failed to fetch data");
    }
  }

  const fullClickAndCollectLocations =
    await getFullLocationsFromCnCResponseLocations(
      clickAndCollectSearchResults
    );

  const transformedResponse = {
    clickAndCollect: fullClickAndCollectLocations,
    inStore: inStoreSearchResults,
  };
  return transformedResponse;
}
