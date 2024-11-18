import request from "supertest";
import app from "../index";

describe("GET /api/getPostcodeSuggestions", () => {
  it("should return 200", async () => {
    const res = await request(app).get("/api/getPostcodeSuggestions?query=ult");
    expect(res.status).toBe(200);
  });
});
