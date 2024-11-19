import { getNumberOfLocationsToSearch } from "../getAllLocations";

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
