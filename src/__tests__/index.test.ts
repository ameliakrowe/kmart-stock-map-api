import request from "supertest";
import app from "../index";
import axios from "axios";
import {
  mockDataResponse,
  mockEmptyDataResponse,
} from "../mocks/getPostcodeSuggestionsResponses";

jest.mock("axios");

describe("GET /api/getPostcodeSuggestions", () => {
  it("should return postcode suggestions", async () => {
    (axios.post as jest.Mock).mockResolvedValue(mockDataResponse);

    const res = await request(app)
      .get("/api/getPostcodeSuggestions")
      .query({ query: "ash" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockDataResponse.data);
  });
  it("should return empty list if no postcode suggestions found", async () => {
    (axios.post as jest.Mock).mockResolvedValue(mockEmptyDataResponse);

    const res = await request(app)
      .get("/api/getPostcodeSuggestions")
      .query({ query: "ddfsgsdfgsdf" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockEmptyDataResponse.data);
  });
  it("should return 400 error if no query string is provided", async () => {
    const res = await request(app)
      .get("/api/getPostcodeSuggestions")
      .query({ query: "" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      errors: [
        {
          type: "field",
          value: "",
          msg: "Search query is required.",
          path: "query",
          location: "query",
        },
      ],
    });
  });
});
