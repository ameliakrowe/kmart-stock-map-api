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
function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
function binarySearchFromCoords(coord) {
    return __awaiter(this, void 0, void 0, function* () {
        let min = 0;
        let max = 1000;
        let counter = 0;
        let result = [];
        while (max - min > 10) {
            const guess = Math.floor((max - min) / 2 + min);
            //console.log("min %d max %d guess %d", min, max, guess);
            try {
                const nearestLocationsResponse = yield (0, getNearestLocations_1.getNearestLocations)(coord.lat.toString(), coord.lon.toString(), guess.toString());
                counter += 1;
                const nearestLocations = nearestLocationsResponse.nearestLocations;
                //console.log("Number of locations: %d", nearestLocationsResponse.nearestLocations.length);
                if (nearestLocationsResponse.nearestLocations.length < 10) {
                    result = nearestLocations;
                    min = guess;
                }
                else {
                    max = guess;
                }
            }
            catch (_a) {
                console.log("Error fetching data from GraphQL API");
                yield delay(10000);
                //throw new Error("Failed to fetch nearest location data");
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
        /*if (coord.coord.lat < -27.25 && coord.coord.lat > -27.75 && coord.coord.lon > 152.75 && coord.coord.lon < 153.25 && centerCoord.lat < -27.45
                && centerCoord.lat > -27.55 && centerCoord.lon > 152.95 && centerCoord.lon < 153.05) {
                console.log("%d %d distance from %d %d: %d", coord.coord.lat, coord.coord.lon, centerCoord.lat, centerCoord.lon, kmFromCenter);
            }*/
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
        const coordLimits = {
            north: -10,
            south: -44,
            west: 112,
            east: 154,
        };
        let searchCoords = [];
        const locations = [];
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
            //console.log('%d S %d E', currentSearchCoord.lat, currentSearchCoord.lon);
        }
        //console.log(searchCoords);
        console.log(getNumberOfLocationsToSearch(searchCoords));
        while (getNumberOfLocationsToSearch(searchCoords) > 0) {
            //const fileName = Date.now().toString();
            /*fs.writeFile(fileName, searchCoords.map((coord) => `${coord.coord.lat} ${coord.coord.lon} ${coord.needToSearch}`).join("\n"), (err: any) => {
                    if (err) {
                        console.error(err);
                    }
                });*/
            const coordToSearch = searchCoords.filter((coord) => coord.needToSearch)[0];
            console.log("lat: %d lon: %d", Math.round(coordToSearch.coord.lat * 10) / 10, Math.round(coordToSearch.coord.lon * 10) / 10);
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
        const fs = require("fs");
        fs.writeFile("locations.json", JSON.stringify(locations, null, 4), (err) => {
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