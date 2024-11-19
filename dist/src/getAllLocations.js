"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLocations = getAllLocations;
const getNearestLocations_1 = require("./getNearestLocations");
const geolib_1 = require("geolib");
const constants_1 = require("./constants");
function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
function binarySearchFromCoords(coord) {
    return __awaiter(this, void 0, void 0, function* () {
        let min = 0;
        let max = 1000;
        let counter = 0;
        let result = [];
        let lastSearchFailed = false;
        while (max - min > 10) {
            const guess = Math.floor((max - min) / 2 + min);
            try {
                const nearestLocationsResponse = yield (0, getNearestLocations_1.getNearestLocations)(coord.lat.toString(), coord.lon.toString(), guess.toString());
                counter += 1;
                const nearestLocations = nearestLocationsResponse.nearestLocations;
                lastSearchFailed = false;
                if (nearestLocationsResponse.nearestLocations.length < 10) {
                    result = nearestLocations;
                    min = guess;
                }
                else {
                    max = guess;
                }
            }
            catch (err) {
                if (!lastSearchFailed) {
                    console.error("Probable rate limit hit on Kmart API. Trying again in 10 seconds");
                    lastSearchFailed = true;
                    yield delay(10000);
                }
                else {
                    console.error(`Unexpected error fetching locations from Kmart API for lat ${Math.round(coord.lat * 10) / 10} lon ${Math.round(coord.lon * 10) / 10} at search distance ${guess}: ${err.message}`);
                    throw new Error("Could not fetch locations");
                }
            }
        }
        return {
            locations: result,
            radiusToExcludeFromSearch: min < 9 ? 9 : min,
            numberOfCallsMade: counter,
        };
    });
}
function excludeCoordsToSearch(coords, centerCoord, radius) {
    coords.forEach((coord) => {
        const kmFromCenter = (0, geolib_1.getDistance)({ latitude: centerCoord.lat, longitude: centerCoord.lon }, { latitude: coord.coord.lat, longitude: coord.coord.lon }) / 1000;
        if (kmFromCenter <= radius - 9) {
            coord.needToSearch = false;
        }
    });
    return coords;
}
function getNumberOfLocationsToSearch(coords) {
    return coords.filter((coord) => coord.needToSearch).length;
}
function getAllLocations() {
    return __awaiter(this, void 0, void 0, function* () {
        let counter = 0;
        const startTime = Date.now();
        let searchCoords = [];
        const locations = [];
        const currentSearchCoord = {
            lat: constants_1.COORD_LIMITS.north,
            lon: constants_1.COORD_LIMITS.west,
        };
        while (currentSearchCoord.lat >= constants_1.COORD_LIMITS.south) {
            searchCoords.push({
                coord: {
                    lat: currentSearchCoord.lat,
                    lon: currentSearchCoord.lon,
                },
                needToSearch: true,
            });
            currentSearchCoord.lon += 0.1;
            if (currentSearchCoord.lon > constants_1.COORD_LIMITS.east) {
                currentSearchCoord.lon = constants_1.COORD_LIMITS.west;
                currentSearchCoord.lat -= 0.1;
            }
        }
        console.log("%d locations left to search", getNumberOfLocationsToSearch(searchCoords));
        while (getNumberOfLocationsToSearch(searchCoords) > 0) {
            const coordToSearch = searchCoords.filter((coord) => coord.needToSearch)[0];
            console.log("Searching for lat: %d lon: %d", Math.round(coordToSearch.coord.lat * 10) / 10, Math.round(coordToSearch.coord.lon * 10) / 10);
            try {
                const result = yield binarySearchFromCoords(coordToSearch.coord);
                console.log("%d locations found", result.locations.length);
                console.log("excluding %d radius", result.radiusToExcludeFromSearch - 9);
                searchCoords = excludeCoordsToSearch(searchCoords, coordToSearch.coord, result.radiusToExcludeFromSearch);
                console.log(getNumberOfLocationsToSearch(searchCoords));
                counter += result.numberOfCallsMade;
                result.locations.forEach((newLocation) => {
                    const matchingLocations = locations.filter((existingLocation) => existingLocation.locationId === newLocation.locationId);
                    if (matchingLocations.length === 0) {
                        locations.push(newLocation);
                    }
                });
            }
            catch (err) {
                throw err;
            }
        }
        const finalResult = {
            locations: locations,
        };
        const fs = require("fs");
        fs.writeFile("locations.json", JSON.stringify(finalResult, null, 4), (err) => {
            if (err) {
                console.error(err);
            }
        });
        const endTime = Date.now();
        return {
            locations,
            numberOfLocations: locations.length,
            numberOfCalls: counter,
            duration: endTime - startTime,
        };
    });
}
//# sourceMappingURL=getAllLocations.js.map