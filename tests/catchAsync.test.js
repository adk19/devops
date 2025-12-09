const catchAsync = require("../src/utils/catchAsync.js");

describe("catchAsync", () => {
  it("should catch async errors and pass them to next", async () => {
    const error = new Error("Test error");
    const mockFn = jest.fn().mockRejectedValue(error);
    const wrappedFn = catchAsync(mockFn);

    const req = {};
    const res = {};
    const next = jest.fn();

    await wrappedFn(req, res, next);

    expect(mockFn).toHaveBeenCalledWith(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it("should not call next if no error occurs", async () => {
    const mockFn = jest.fn().mockResolvedValue("success");
    const wrappedFn = catchAsync(mockFn);

    const req = {};
    const res = {};
    const next = jest.fn();

    await wrappedFn(req, res, next);

    expect(mockFn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
});
