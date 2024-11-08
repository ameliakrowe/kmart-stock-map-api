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
