// ✅ MOCK FIRST (VERY IMPORTANT)
jest.mock("mongoose", () => {
  const originalMongoose = jest.requireActual("mongoose");
  return {
    ...originalMongoose,
    connect: jest.fn(),
    connection: {
      ...originalMongoose.connection,
      readyState: 0,
      on: jest.fn(),
      once: jest.fn(),
    },
  };
});

// ✅ THEN import
const mongoose = require("mongoose");
const connectDB = require("../src/configs/db.js");

describe("Database Connection", () => {
  let originalExit;
  let originalError;

  beforeAll(() => {
    originalExit = process.exit;
    originalError = console.error;
    process.exit = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    process.exit = originalExit;
    console.error = originalError;
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mongoose.connection.readyState = 0;
  });

  it("should connect to MongoDB", async () => {
    mongoose.connect.mockResolvedValueOnce({
      connection: { readyState: 1 },
    });

    await expect(connectDB()).resolves.not.toThrow();
    expect(mongoose.connect).toHaveBeenCalled();
  });

  it("should handle connection errors", async () => {
    const errorMessage = "Connection failed";
    mongoose.connect.mockRejectedValueOnce(new Error(errorMessage));

    const errorSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await connectDB();

    expect(process.exit).toHaveBeenCalledWith(1);
    expect(errorSpy).toHaveBeenCalled();

    const loggedError = errorSpy.mock.calls[0][0];
    expect(loggedError).toBeInstanceOf(Error);
    expect(loggedError.message).toBe(errorMessage);

    errorSpy.mockRestore();
  });
});
