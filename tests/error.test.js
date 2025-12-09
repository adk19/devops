const httpMocks = require("node-mocks-http");
const errorHandler = require("../src/middlewares/error.js");
const ApiError = require("../src/utils/ApiErrors.js");

describe("Error Middleware", () => {
  let req, res, next, errorSpy;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();

    errorSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    if (errorSpy) {
      errorSpy.mockRestore();
    }
  });

  it("should handle ApiError", () => {
    const error = new ApiError(400, "Test error");

    // ✅ Must pass next
    errorHandler(error, req, res, next);

    res;
    console.log(res.status);
    console.log(res.statusCode);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      status: false,
      message: "Test error",
    });
  });

  it("should handle ValidationError", () => {
    const error = new Error("Validation failed");
    error.name = "ValidationError";
    error.errors = {
      email: { message: "Invalid email" },
      password: { message: "Too short" },
    };

    errorHandler(error, req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toContain("Internal Server Error");
  });

  it("should handle CastError", () => {
    const error = new Error("Cast to ObjectId failed");
    error.name = "CastError";
    error.path = "_id";
    error.value = "invalid-id";

    errorHandler(error, req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toContain("Internal Server Error");
  });

  it("should handle duplicate key error", () => {
    const error = new Error("Duplicate key error");
    error.code = 11000;
    error.keyValue = { email: "test@example.com" };

    errorHandler(error, req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toContain("Internal Server Error");
  });

  it("should handle JWT errors", () => {
    const error = new Error("Invalid token");
    error.name = "JsonWebTokenError";

    errorHandler(error, req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toBe("Internal Server Error");
  });

  it("should handle TokenExpiredError", () => {
    const error = new Error("Token expired");
    error.name = "TokenExpiredError";

    errorHandler(error, req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toBe("Internal Server Error");
  });

  it("should handle other errors", () => {
    const error = new Error("Unexpected error");

    errorHandler(error, req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toBe("Internal Server Error");
  });
});
