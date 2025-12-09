const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

// Set required environment variables for testing
process.env.PORT = "3000";
process.env.NODE_ENV = "test";
process.env.REQUEST_BODY_LIMIT = "10mb";
process.env.RATE_LIMIT_WINDOW_MS = "900000";
process.env.RATE_LIMIT_MAX = "100";
process.env.CORS_ORIGIN = "http://allowed-origin.com,http://localhost:3000";
process.env.MONGODB_URL = "mongodb://localhost:27017/test";
process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.JWT_EXPIRES_IN = "7d";

let mongoServer;
jest.setTimeout(30000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});
