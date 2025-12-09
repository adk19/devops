// test/envConfig.test.js
describe("Environment Configuration", () => {
  let originalEnv;
  let originalConfig;

  beforeAll(() => {
    // Save original environment variables and config
    originalEnv = { ...process.env };
    originalConfig = {
      ...require.cache[require.resolve("../src/configs/envConfig")],
    };
  });

  afterEach(() => {
    // Restore original environment and clear require cache
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  afterAll(() => {
    // Restore the original config
    require.cache[require.resolve("../src/configs/envConfig")] = originalConfig;
  });

  // Test if required environment variables are loaded
  it("should load all required environment variables", () => {
    const envConfig = require("../src/configs/envConfig");
    expect(envConfig).toHaveProperty("port");
    expect(envConfig).toHaveProperty("env");
    expect(envConfig).toHaveProperty("body");
    expect(envConfig).toHaveProperty("cors");
    expect(envConfig).toHaveProperty("mongo");
    expect(envConfig).toHaveProperty("rate-limit");
    expect(envConfig).toHaveProperty("jwt");
  });

  // Test environment-specific configurations
  it("should have correct configuration structure", () => {
    const envConfig = require("../src/configs/envConfig");
    // Test CORS configuration
    expect(envConfig).toHaveProperty("cors");
    expect(typeof envConfig.cors).toBe("string");

    // Test rate limit configuration
    expect(envConfig["rate-limit"]).toHaveProperty("window_ms");
    expect(envConfig["rate-limit"]).toHaveProperty("max");
    expect(Number(envConfig["rate-limit"].window_ms)).toBeGreaterThan(0);
    expect(Number(envConfig["rate-limit"].max)).toBeGreaterThan(0);

    // Test MongoDB configuration
    expect(envConfig).toHaveProperty("mongo");
    expect(typeof envConfig.mongo).toBe("string");

    // Test JWT configuration
    expect(envConfig.jwt).toHaveProperty("secret");
    expect(envConfig.jwt).toHaveProperty("expire");
    expect(typeof envConfig.jwt.secret).toBe("string");
    expect(typeof envConfig.jwt.expire).toBe("string");
  });

  // Test default values
  it("should have default values for optional configurations", () => {
    const envConfig = require("../src/configs/envConfig");
    expect(envConfig.port).toBeDefined();
    expect(typeof envConfig.port).toBe("number");
    expect(envConfig.port).toBeGreaterThan(0);
  });

  // Test environment variable validation
  it("should throw error for invalid environment variables", () => {
    // Test with invalid PORT (not a number)
    process.env.PORT = "invalid";
    delete require.cache[require.resolve("../src/configs/envConfig")];
    expect(() => require("../src/configs/envConfig")).toThrow();

    // Test with missing required variable
    delete process.env.NODE_ENV;
    delete require.cache[require.resolve("../src/configs/envConfig")];
    expect(() => require("../src/configs/envConfig")).toThrow();
  });
});
