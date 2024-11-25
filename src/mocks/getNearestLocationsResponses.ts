import { NearestLocation } from "../types/NearestLocation";

export const mockImplementationNoStores = (
  lat: number,
  lon: number,
  distance: number
): NearestLocation[] => {
  return [];
};

export const mockImplementationLessThanNineStores = (
  lat: number,
  lon: number,
  distance: number
): NearestLocation[] => {
  const nearestStores = [
    {
      locationId: "1225",
      publicName: "Coolalinga",
      latitude: "-12.520862899999999",
      longitude: "131.04098060000001",
      postcode: "839",
    },
    {
      locationId: "1049",
      publicName: "Darwin",
      latitude: "-12.376150000000001",
      longitude: "130.881079",
      postcode: "810",
    },
    {
      locationId: "3307",
      publicName: "Katherine K Hub",
      latitude: "-14.462982",
      longitude: "132.26843299999999",
      postcode: "850",
    },
  ];
  if (distance < 53) {
    return [];
  } else if (distance < 118) {
    return nearestStores.slice(0, 1);
  } else if (distance < 213) {
    return nearestStores.slice(0, 2);
  } else {
    return nearestStores;
  }
};

export const mockImplementationMoreThanNineStores = (
  lat: number,
  lon: number,
  distance: number
): NearestLocation[] => {
  const nearestStores = [
    {
      locationId: "1292",
      publicName: "Castlemaine K Hub",
      latitude: "-37.065544600000003",
      longitude: "144.2153467",
      postcode: "3450",
    },
    {
      locationId: "1396",
      publicName: "Maryborough",
      latitude: "-37.048308587298493",
      longitude: "143.74186052513102",
      postcode: "3465",
    },
    {
      locationId: "1045",
      publicName: "Bendigo",
      latitude: "-36.809997000000003",
      longitude: "144.241241",
      postcode: "3555",
    },
    {
      locationId: "1293",
      publicName: "Woodend K Hub",
      latitude: "-37.355507500000002",
      longitude: "144.5270615",
      postcode: "3442",
    },
    {
      locationId: "1037",
      publicName: "Wendouree",
      latitude: "-37.534012999999995",
      longitude: "143.82487599999999",
      postcode: "3355",
    },
    {
      locationId: "1261",
      publicName: "Delacombe",
      latitude: "-37.590738600000002",
      longitude: "143.80563759999995",
      postcode: "3351",
    },
    {
      locationId: "1157",
      publicName: "Melton",
      latitude: "-37.685986",
      longitude: "144.56508700000001",
      postcode: "3337",
    },
    {
      locationId: "3316",
      publicName: "Ararat K Hub",
      latitude: "-37.283000000000001",
      longitude: "142.92901000000001",
      postcode: "3377",
    },
    {
      locationId: "1290",
      publicName: "Seymour K Hub",
      latitude: "-37.024127",
      longitude: "145.13381799999999",
      postcode: "3660",
    },
    {
      locationId: "1382",
      publicName: "Watergardens",
      latitude: "-37.70026",
      longitude: "144.77377300000001",
      postcode: "3038",
    },
  ];
  if (distance < 20) {
    return [];
  } else if (distance < 24) {
    return nearestStores.slice(0, 1);
  } else if (distance < 30) {
    return nearestStores.slice(0, 2);
  } else if (distance < 61) {
    return nearestStores.slice(0, 3);
  } else if (distance < 68) {
    return nearestStores.slice(0, 5);
  } else if (distance < 91) {
    return nearestStores.slice(0, 6);
  } else if (distance < 100) {
    return nearestStores.slice(0, 7);
  } else if (distance < 101) {
    return nearestStores.slice(0, 8);
  } else if (distance < 104) {
    return nearestStores.slice(0, 9);
  } else {
    return nearestStores;
  }
};

export const mockImplementationNineStores = (
  lat: number,
  lon: number,
  distance: number
): NearestLocation[] => {
  const nearestStores = [
    {
      locationId: "3307",
      publicName: "Katherine K Hub",
      latitude: "-14.462982",
      longitude: "132.26843299999999",
      postcode: "850",
    },
    {
      locationId: "1225",
      publicName: "Coolalinga",
      latitude: "-12.520862899999999",
      longitude: "131.04098060000001",
      postcode: "839",
    },
    {
      locationId: "1049",
      publicName: "Darwin",
      latitude: "-12.376150000000001",
      longitude: "130.881079",
      postcode: "810",
    },
    {
      locationId: "3347",
      publicName: "Port Douglas K Hub",
      latitude: "-16.481901000000001",
      longitude: "145.462827",
      postcode: "4877",
    },
    {
      locationId: "1025",
      publicName: "Mt Isa",
      latitude: "-20.725895999999999",
      longitude: "139.495057",
      postcode: "4825",
    },
    {
      locationId: "3335",
      publicName: "Mareeba K Hub",
      latitude: "-16.997723000000001",
      longitude: "145.42460399999999",
      postcode: "4880",
    },
    {
      locationId: "1149",
      publicName: "Smithfield",
      latitude: "-16.837067999999999",
      longitude: "145.69223199999999",
      postcode: "4870",
    },
    {
      locationId: "1383",
      publicName: "Cairns",
      latitude: "-16.925176962430324",
      longitude: "145.77208269663564",
      postcode: "4870",
    },
    {
      locationId: "1203",
      publicName: "Mt Sheridan",
      latitude: "-16.989149000000001",
      longitude: "145.74042499999996",
      postcode: "4868",
    },
  ];

  if (distance < 657) {
    return [];
  } else if (distance < 755) {
    return nearestStores.slice(0, 1);
  } else if (distance < 773) {
    return nearestStores.slice(0, 2);
  } else if (distance < 917) {
    return nearestStores.slice(0, 3);
  } else if (distance < 928) {
    return nearestStores.slice(0, 4);
  } else if (distance < 941) {
    return nearestStores.slice(0, 5);
  } else if (distance < 957) {
    return nearestStores.slice(0, 6);
  } else if (distance < 969) {
    return nearestStores.slice(0, 7);
  } else if (distance < 970) {
    return nearestStores.slice(0, 8);
  } else {
    return nearestStores;
  }
};

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
