"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductAvailability = getProductAvailability;
const axios_1 = __importDefault(require("axios"));
const geolib_1 = require("geolib");
const locationData = __importStar(require("../locations.json"));
const constants_1 = require("./constants");
const allLocations = locationData.locations;
function getFullLocationsFromCnCResponseLocations(locations) {
    const result = [];
    locations.forEach((location) => {
        const matchingLocations = allLocations.filter((nearestLocation) => nearestLocation.locationId == location.location.locationId);
        const matchingLocation = matchingLocations.length > 0 ? matchingLocations[0] : null;
        const matchingFulfilmentLocations = allLocations.filter((nearestLocation) => nearestLocation.locationId == location.fulfilment.locationId);
        const matchingFulfilmentLocation = matchingFulfilmentLocations.length > 0
            ? matchingFulfilmentLocations[0]
            : null;
        const locationResult = matchingLocation && matchingFulfilmentLocation
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
function getLocationsWithinRadius(lat, lon, searchRadius) {
    return allLocations.filter((location) => (0, geolib_1.getDistance)({ latitude: location.latitude, longitude: location.longitude }, { latitude: lat, longitude: lon }) /
        1000 <
        searchRadius);
}
function generateClickAndCollectVariables(postcode, productSKU) {
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
function generateInStoreVariables(postcode, productSKU) {
    return {
        input: {
            country: "AU",
            postcode,
            keycodes: [productSKU],
        },
    };
}
function getProductAvailability(productSKU, postcode, lat, lon, searchRadius) {
    return __awaiter(this, void 0, void 0, function* () {
        function addNewResultsToClickAndCollectSearchResults(oldResults, newResults, locationsToInclude) {
            newResults.forEach((newResult) => {
                const existingMatchingLocations = oldResults.filter((existingResult) => newResult.location.locationId === existingResult.location.locationId);
                if (existingMatchingLocations.length < 1 &&
                    locationsToInclude
                        .map((location) => location.locationId)
                        .includes(newResult.location.locationId)) {
                    oldResults.push(newResult);
                }
            });
            return oldResults;
        }
        function addNewResultsToInStoreSearchResults(oldResults, newResults, locationsToInclude) {
            newResults.forEach((newResult) => {
                const existingMatchingLocations = oldResults.filter((existingResult) => newResult.locationId === existingResult.locationId);
                if (existingMatchingLocations.length < 1 &&
                    locationsToInclude
                        .map((location) => location.locationId)
                        .includes(newResult.locationId.toString())) {
                    oldResults.push(newResult);
                }
            });
            return oldResults;
        }
        console.log("start");
        const locationsWithinRadius = getLocationsWithinRadius(lat, lon, searchRadius);
        let locationsToSearchClickAndCollect = locationsWithinRadius.map((location) => ({
            locationId: location.locationId,
            postcode: location.postcode,
            publicName: location.publicName,
        }));
        let locationsToSearchInStore = locationsWithinRadius.map((location) => ({
            locationId: location.locationId,
            postcode: location.postcode,
            publicName: location.publicName,
        }));
        let clickAndCollectSearchResults = [];
        let inStoreSearchResults = [];
        console.log(locationsToSearchClickAndCollect);
        while (locationsToSearchClickAndCollect.length > 0) {
            try {
                const locationToSearch = locationsToSearchClickAndCollect[0];
                console.log("searching c&c for store %s: %s, %s", locationToSearch.locationId, locationToSearch.publicName, locationToSearch.postcode);
                const clickAndCollectResponse = yield axios_1.default.post(constants_1.KMART_API_URL, {
                    query: constants_1.CLICK_AND_COLLECT_API_QUERY,
                    operationName: "getProductAvailability",
                    variables: generateClickAndCollectVariables(locationToSearch.postcode, productSKU),
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const clickAndCollectLocations = clickAndCollectResponse.data.data
                    .getProductAvailability.availability.CLICK_AND_COLLECT[0]
                    .locations;
                const locationIdsFound = clickAndCollectLocations.map((location) => location.location.locationId);
                locationsToSearchClickAndCollect =
                    locationsToSearchClickAndCollect.filter((location) => !locationIdsFound.includes(location.locationId) &&
                        location.locationId !== locationToSearch.locationId);
                clickAndCollectSearchResults =
                    addNewResultsToClickAndCollectSearchResults(clickAndCollectSearchResults, clickAndCollectLocations, locationsWithinRadius);
            }
            catch (error) {
                console.error("Error getting product availability", error);
                throw new Error("Failed to fetch data");
            }
        }
        while (locationsToSearchInStore.length > 0) {
            try {
                const locationToSearch = locationsToSearchInStore[0];
                console.log("searching in store for store %s: %s, %s", locationToSearch.locationId, locationToSearch.publicName, locationToSearch.postcode);
                const inStoreResponse = yield axios_1.default.post(constants_1.KMART_API_URL, {
                    query: constants_1.IN_STORE_API_QUERY,
                    operationName: "getFindInStore",
                    variables: generateInStoreVariables(locationToSearch.postcode, productSKU),
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (inStoreResponse.data.data.findInStoreQuery.length < 1) {
                    throw new Error("No product found for the specified SKU. Please check input and try again.");
                }
                const inStoreLocations = inStoreResponse.data.data.findInStoreQuery[0]
                    .inventory;
                const locationIdsFound = inStoreLocations.map((location) => location.locationId.toString());
                locationsToSearchInStore = locationsToSearchInStore.filter((location) => !locationIdsFound.includes(location.locationId) &&
                    location.locationId != locationToSearch.locationId);
                inStoreSearchResults = addNewResultsToInStoreSearchResults(inStoreSearchResults, inStoreLocations, locationsWithinRadius);
            }
            catch (error) {
                const axiosError = error;
                console.error("Error getting product availability", error);
                throw new Error(axiosError.message);
            }
        }
        console.log("search complete");
        const fullClickAndCollectLocations = yield getFullLocationsFromCnCResponseLocations(clickAndCollectSearchResults);
        const transformedResponse = {
            clickAndCollect: fullClickAndCollectLocations,
            inStore: inStoreSearchResults,
        };
        return transformedResponse;
    });
}
//# sourceMappingURL=getProductAvailability.js.map