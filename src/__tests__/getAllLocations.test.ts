import {
  excludeSearchCoordsWithinRadius,
  getNumberOfLocationsToSearch,
} from "../getAllLocations";

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
