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
const constants_1 = require("./utils/constants");
function getNearestLocations(lat, lon, distance) {
    return __awaiter(this, void 0, void 0, function* () {
        const variables = {
            lat: lat.toString(),
            lon: lon.toString(),
            distance: distance.toString() + "km",
        };
        try {
            const response = yield axios_1.default.post(constants_1.KMART_API_URL, {
                query: constants_1.NEAREST_LOCATIONS_API_QUERY,
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
        catch (err) {
            throw err;
        }
    });
}
//# sourceMappingURL=getNearestLocations.js.map