"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COORD_LIMITS = exports.POSTCODE_SUGGESTIONS_API_QUERY = exports.NEAREST_LOCATIONS_API_QUERY = exports.IN_STORE_API_QUERY = exports.CLICK_AND_COLLECT_API_QUERY = exports.KMART_API_URL = void 0;
exports.KMART_API_URL = "https://api.kmart.com.au/gateway/graphql";
exports.CLICK_AND_COLLECT_API_QUERY = `
    query getProductAvailability($input: ProductAvailabilityQueryInput!) {
        getProductAvailability(input: $input) {
            availability {
                CLICK_AND_COLLECT {
                    locations {
                        fulfilment {
                            isBuddyLocation
                            locationId
                            stock {
                                available
                            }
                        }
                        location {
                            locationId
                        }
                    }
                }
            }
        }
    }
`;
exports.IN_STORE_API_QUERY = `
    query getFindInStore($input: FindInStoreQueryInput!) {
        findInStoreQuery(input: $input) {
            keycode
            inventory {
                locationName
                locationId
                stockLevel
            }
        }
    }
`;
exports.NEAREST_LOCATIONS_API_QUERY = `
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
exports.POSTCODE_SUGGESTIONS_API_QUERY = `
        query getPostcodeSuggestions($input: PostcodeQueryInput!) {
            postcodeQuery(input: $input) {
                postcode
                suburb
                state
                location {
                    lat
                    lon
                }
            }
        }
    `;
exports.COORD_LIMITS = {
    north: -10,
    south: -44,
    west: 112,
    east: 154,
};
//# sourceMappingURL=constants.js.map