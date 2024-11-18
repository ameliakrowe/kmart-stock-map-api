import { PostcodeSuggestion } from "../types/PostcodeSuggestion";

export const mockDataResponse = {
  data: {
    postcodeQuery: [
      {
        postcode: "3442",
        suburb: "ASHBOURNE",
        state: "VIC",
        location: {
          lat: -37.4017,
          lon: 144.4588,
        },
      },
      {
        postcode: "5157",
        suburb: "ASHBOURNE",
        state: "SA",
        location: {
          lat: -35.2985,
          lon: 138.7647,
        },
      },
      {
        postcode: "3147",
        suburb: "ASHBURTON",
        state: "VIC",
        location: {
          lat: -37.867,
          lon: 145.0781,
        },
      },
      {
        postcode: "2193",
        suburb: "ASHBURY",
        state: "NSW",
        location: {
          lat: -33.9011,
          lon: 151.1179,
        },
      },
      {
        postcode: "2463",
        suburb: "ASHBY",
        state: "NSW",
        location: {
          lat: -29.4427,
          lon: 153.1846,
        },
      },
      {
        postcode: "6065",
        suburb: "ASHBY",
        state: "WA",
        location: {
          lat: -31.7341,
          lon: 115.7969,
        },
      },
      {
        postcode: "2463",
        suburb: "ASHBY HEIGHTS",
        state: "NSW",
        location: {
          lat: -29.4005,
          lon: 153.1793,
        },
      },
      {
        postcode: "2463",
        suburb: "ASHBY ISLAND",
        state: "NSW",
        location: {
          lat: -29.4258,
          lon: 153.204,
        },
      },
      {
        postcode: "2168",
        suburb: "ASHCROFT",
        state: "NSW",
        location: {
          lat: -33.9169,
          lon: 150.901,
        },
      },
      {
        postcode: "6111",
        suburb: "ASHENDON",
        state: "WA",
        location: {
          lat: -32.2097,
          lon: 116.2099,
        },
      },
    ],
  },
};

export const mockEmptyDataResponse = {
  data: {
    postcodeQuery: [] as PostcodeSuggestion[],
  },
};
