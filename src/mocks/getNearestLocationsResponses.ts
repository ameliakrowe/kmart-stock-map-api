import { NearestLocation } from "../types/NearestLocation";

export const mockDataResponse = {
  data: {
    data: {
      nearestLocations: [
        {
          locationId: "1377",
          publicName: "Tuggerah",
          latitude: "-33.307636218334643",
          longitude: "151.41251825557777",
        },
        {
          locationId: "1130",
          publicName: "Gorokan",
          latitude: "-33.240976882895765",
          longitude: "151.50257535720581",
        },
        {
          locationId: "1113",
          publicName: "Maitland",
          latitude: "-32.732861999999997",
          longitude: "151.556119",
        },
      ],
    },
  },
};

export const mockEmptyDataResponse = {
  data: {
    data: {
      nearestLocations: null as NearestLocation[] | null,
    },
  },
};

export const mockErrorResponse = {
  errors: [
    {
      message:
        'Cannot query field "longitudes" on type "Location". Did you mean "longitude" or "latitude"?',
      locations: [
        {
          line: 6,
          column: 9,
        },
      ],
      extensions: {
        code: "GRAPHQL_VALIDATION_FAILED",
      },
    },
  ],
};
