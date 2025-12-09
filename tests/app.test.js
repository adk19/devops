// test/app.test.js
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../src/app.js");

describe("CORS Middleware", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should allow requests from allowed origins", async () => {
    const origin = "http://allowed-origin.com";

    const res = await request(app).get("/").set("Origin", origin);
    expect(res.headers["access-control-allow-origin"]).toBe(origin);
    expect(res.status).toBe(200);
  });

  it("should block requests from disallowed origins", async () => {
    const origin = "http://disallowed-origin.com";

    const res = await request(app).get("/").set("Origin", origin);
    expect(res.status).toBe(500);
  });

  it("should handle requests with no origin header gracefully", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
  });
});
