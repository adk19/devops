const ApiError = require("../src/utils/ApiErrors.js");

describe("ApiError", () => {
  it("should create an instance with default values", () => {
    const error = new ApiError(400, "Bad Request");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe("Bad Request");
    expect(error.status).toBe(false);
    expect(error.isOperational).toBe(true);
    expect(error.stack).toBeDefined();
  });

  it("should create an instance with custom isOperational flag", () => {
    const error = new ApiError(500, "Internal Server Error", false);

    expect(error.isOperational).toBe(false);
  });

  it("should allow setting a custom stack trace", () => {
    const customStack = "Custom stack trace";
    const error = new ApiError(404, "Not Found", true, customStack);

    expect(error.stack).toBe(customStack);
  });

  it("should capture stack trace by default", () => {
    const error = new ApiError(400, "Error with default stack");

    expect(typeof error.stack).toBe("string");
    expect(error.stack).toContain("Error: Error with default stack");
  });

  it("should handle empty message", () => {
    const error = new ApiError(400, "");

    expect(error.message).toBe("");
    expect(error.statusCode).toBe(400);
  });
});
