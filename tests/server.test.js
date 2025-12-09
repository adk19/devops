const request = require("supertest");
const app = require("../src/app.js");

describe("Server", () => {
  it("should return 404 for non-existent routes", async () => {
    const res = await request(app).get("/non-existent-route");

    expect(res.statusCode).toBe(404);
    expect(res.error.message).toBe("cannot GET /non-existent-route (404)");
  });

  it("should handle JSON parsing error", async () => {
    const res = await request(app).post("/api/user").set("Content-Type", "application/json").send("invalid-json");

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should handle CORS preflight requests", async () => {
    const res = await request(app)
      .options("/api/user")
      .set("Origin", "http://localhost:3000")
      .set("Access-Control-Request-Method", "POST")
      .set("Access-Control-Request-Headers", "content-type");

    expect(res.statusCode).toBe(204);
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
  });
});
