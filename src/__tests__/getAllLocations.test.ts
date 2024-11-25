import {
  binarySearchStoreLocations,
  excludeSearchCoordsWithinRadius,
  getNumberOfLocationsToSearch,
} from "../getAllLocations";
import { getNearestLocations } from "../getNearestLocations";
import {
  mockImplementationLessThanNineStores,
  mockImplementationMoreThanNineStores,
  mockImplementationNineStores,
  mockImplementationNoStores,
} from "../mocks/getNearestLocationsResponses";
import { delay } from "../utils/utils";

jest.mock("../getNearestLocations");
jest.mock("../utils/utils");

describe("binarySearchStoreLocations", () => {
  const mockGetNearestLocations = getNearestLocations as jest.Mock;
  const mockDelay = delay as jest.Mock;

  it("should return correct stores and radius of 983 when there are less than 9 stores within 1000km", async () => {
    mockGetNearestLocations.mockImplementation(
      mockImplementationLessThanNineStores
    );
    const result = await binarySearchStoreLocations({ lat: -13, lon: 131 });
    expect(result.locations).toEqual(
      mockImplementationLessThanNineStores(-13, 131, 1000)
    );
    expect(result.radiusToExcludeFromSearch).toBe(983);
  });
  it("should return empty list of stores and radius of 983 when there are no stores within 1000km", async () => {
    mockGetNearestLocations.mockImplementation(mockImplementationNoStores);
    const result = await binarySearchStoreLocations({ lat: -42, lon: 130 });
    expect(result.locations).toEqual([]);
    expect(result.radiusToExcludeFromSearch).toBe(983);
  });
  it("should return correct list of stores and radius when there are more than 10 stores within 1000km", async () => {
    mockGetNearestLocations.mockImplementation(
      mockImplementationMoreThanNineStores
    );
    const result = await binarySearchStoreLocations({ lat: -37, lon: 144 });
    console.log(result);
    expect(result.locations).toEqual([
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
    ]);
    expect(result.radiusToExcludeFromSearch).toBe(92);
  });
  it("should return correct list of stores and radius when there are exactly 9 stores within 1000km", async () => {
    mockGetNearestLocations.mockImplementation(mockImplementationNineStores);
    const result = await binarySearchStoreLocations({ lat: -12.5, lon: 138 });
    expect(result.locations).toEqual(
      mockImplementationNineStores(-12.5, 138, 983)
    );
    expect(result.radiusToExcludeFromSearch).toBe(983);
  });
  it("should retry on rate limit", async () => {
    mockGetNearestLocations
      .mockRejectedValueOnce(new Error("Rate limit exceeded"))
      .mockImplementation(mockImplementationLessThanNineStores);
    mockDelay.mockResolvedValueOnce(undefined);

    const result = await binarySearchStoreLocations({ lat: -13, lon: 131 });
    expect(mockDelay).toHaveBeenCalledWith(10000);
    expect(result.locations).toEqual(
      mockImplementationLessThanNineStores(-13, 131, 1000)
    );
    expect(result.radiusToExcludeFromSearch).toBe(983);
  });
  it("should error on two consecutive failures", async () => {
    mockGetNearestLocations.mockRejectedValue(new Error("Unknown error"));
    mockDelay.mockResolvedValueOnce(undefined);

    await expect(
      binarySearchStoreLocations({ lat: -13, lon: 131 })
    ).rejects.toThrow("Could not fetch locations");
    expect(mockDelay).toHaveBeenCalledWith(10000);
  });
});

describe("excludeSearchCoordsWithinRadius", () => {
  it("should return empty list for empty list of search coords", () => {
    const result = excludeSearchCoordsWithinRadius(
      [],
      { lat: -33, lon: 151 },
      20
    );
    expect(result).toEqual([]);
  });
  it("should set needToSearch to false for single coordinate within radius", () => {
    const result = excludeSearchCoordsWithinRadius(
      [{ coord: { lat: -33, lon: 151 }, needToSearch: true }],
      { lat: -33.1, lon: 151.1 },
      20
    );
    expect(result).toEqual([
      { coord: { lat: -33, lon: 151 }, needToSearch: false },
    ]);
  });
  it("should set needToSearch to false for only the coordinates that are within radius", () => {
    const result = excludeSearchCoordsWithinRadius(
      [
        { coord: { lat: -33, lon: 151 }, needToSearch: true },
        { coord: { lat: -33.1, lon: 151 }, needToSearch: true },
        { coord: { lat: -35, lon: 149 }, needToSearch: true },
      ],
      { lat: -33.1, lon: 151.1 },
      20
    );
    expect(result).toEqual([
      { coord: { lat: -33, lon: 151 }, needToSearch: false },
      { coord: { lat: -33.1, lon: 151 }, needToSearch: false },
      { coord: { lat: -35, lon: 149 }, needToSearch: true },
    ]);
  });
  it("should set needToSearch to false for coordinate that is the same as center coordinate", () => {
    const result = excludeSearchCoordsWithinRadius(
      [{ coord: { lat: -33.1, lon: 151.1 }, needToSearch: true }],
      { lat: -33.1, lon: 151.1 },
      0
    );
    expect(result).toEqual([
      { coord: { lat: -33.1, lon: 151.1 }, needToSearch: false },
    ]);
  });
});

describe("getNumberOfLocationsToSearch", () => {
  it("should return 0 for empty list of search coords", () => {
    const result = getNumberOfLocationsToSearch([]);
    expect(result).toBe(0);
  });
  it("should return correct number for list with some needToSearch = true", () => {
    const result = getNumberOfLocationsToSearch([
      { coord: { lat: 33, lon: 151 }, needToSearch: true },
      { coord: { lat: 33, lon: 151 }, needToSearch: false },
      { coord: { lat: 33.2, lon: 151.2 }, needToSearch: true },
    ]);
    expect(result).toBe(2);
  });
  it("should return 0 for list with no needToSearch = true", () => {
    const result = getNumberOfLocationsToSearch([
      { coord: { lat: 33, lon: 151 }, needToSearch: false },
      { coord: { lat: 33, lon: 151 }, needToSearch: false },
      { coord: { lat: 33.2, lon: 151.2 }, needToSearch: false },
    ]);
    expect(result).toBe(0);
  });
});
