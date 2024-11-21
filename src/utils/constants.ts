export const KMART_API_URL = "https://api.kmart.com.au/gateway/graphql";

export const CLICK_AND_COLLECT_API_QUERY = `
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

export const IN_STORE_API_QUERY = `
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

export const NEAREST_LOCATIONS_API_QUERY = `
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
export const POSTCODE_SUGGESTIONS_API_QUERY = `
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

export const COORD_LIMITS = {
  north: -10,
  south: -44,
  west: 112,
  east: 154,
};
