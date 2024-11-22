import axios from "axios";
import { getNearestLocations } from "../getNearestLocations";
import {
  mockDataResponse,
  mockEmptyDataResponse,
  mockErrorResponse,
} from "../mocks/getNearestLocationsResponses";

jest.mock("axios");

describe("getNearestLocations", () => {
  it("should return nearest locations correctly", async () => {
    (axios.post as jest.Mock).mockResolvedValue(mockDataResponse);

    const result = await getNearestLocations(-33, 151, 60);
    expect(result).toEqual(mockDataResponse.data.data);
  });
  it("should return empty list if no locations are found in radius", async () => {
    (axios.post as jest.Mock).mockResolvedValue(mockEmptyDataResponse);

    const result = await getNearestLocations(-33, 151, 10);
    expect(result).toEqual({ nearestLocations: [] });
  });
  it("should throw error if API call fails", async () => {
    (axios.post as jest.Mock).mockRejectedValue(mockErrorResponse);

    await expect(getNearestLocations(-33, 151, 50)).rejects.toBe(
      mockErrorResponse
    );
  });
});
