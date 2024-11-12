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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNearestLocations = getNearestLocations;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
function getNearestLocations(lat, lon, distance) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiQuery = `
        query getNearestLocations($lat: String!, $lon: String!, $distance: String!) {
            nearestLocations(input: {lat: $lat, lon: $lon, distance: $distance}) {
                locationId
                publicName
                latitude
                longitude
                postcode
            }
        }
    `;
        const variables = {
            lat,
            lon,
            distance: distance + "km",
        };
        try {
            const response = yield axios_1.default.post(constants_1.KMART_API_URL, {
                query: apiQuery,
                operationName: "getNearestLocations",
                variables,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data.data.nearestLocations
                ? response.data.data
                : {
                    nearestLocations: [],
                };
        }
        catch (error) {
            console.error("Error fetching data from GraphQL API:", error);
            throw new Error("Failed to fetch data");
        }
    });
}
//# sourceMappingURL=getNearestLocations.js.map