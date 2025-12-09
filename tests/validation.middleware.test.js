const httpMocks = require("node-mocks-http");
const { validate } = require("../src/middlewares/schemaValidate.js");
const Joi = require("joi");

describe("Validation Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should call next() if validation passes", () => {
    const schema = {
      body: Joi.object({
        name: Joi.string().required(),
        age: Joi.number().integer().min(0),
      }),
    };

    req.body = { name: "John", age: 25 };
    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeUndefined();
  });

  it("should call next() with error if validation fails", () => {
    const schema = {
      body: Joi.object({
        name: Joi.string().required(),
        age: Joi.number().integer().min(0),
      }),
    };

    req.body = { age: -5 }; // Invalid age
    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it("should validate query parameters", () => {
    const schema = {
      query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
      }),
    };

    req.query = { page: "2", limit: "20" };
    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.query).toEqual({ page: 2, limit: 20 });
  });

  it("should validate route parameters", () => {
    const schema = {
      params: Joi.object({
        id: Joi.string().hex().length(24).required(),
      }),
    };

    req.params = { id: "507f1f77bcf86cd799439011" }; // Valid MongoDB ObjectId
    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeUndefined();
  });
});
