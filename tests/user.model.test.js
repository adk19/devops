// test/user.model.test.js
const User = require("../src/models/userModel.js");

describe("User Model", () => {
  let user;

  beforeAll(async () => {
    // Clear the database before all tests
    await User.deleteMany({});
  });

  beforeEach(async () => {
    // Create a fresh user before each test
    user = new User({
      name: "Test User",
      email: `test-${Date.now()}@example.com`, // Ensure unique email for each test
      password: "password123",
    });
    await user.save();
  });

  afterEach(async () => {
    // Clean up after each test
    await User.deleteOne({ _id: user._id });
  });

  it("should encrypt password on save", async () => {
    expect(user.password).not.toBe("password123");
    expect(user.password).toHaveLength(60);
  });

  it("should compare password correctly", async () => {
    const isMatch = await user.comparePassword("password123");
    expect(isMatch).toBe(true);

    const isNotMatch = await user.comparePassword("wrongpassword");
    expect(isNotMatch).toBe(false);
  });

  it("should hash password on update", async () => {
    const userId = user._id;
    const newPassword = "newpassword123";

    // Find the user fresh from the database
    const userToUpdate = await User.findById(userId);
    userToUpdate.password = newPassword;
    await userToUpdate.save();

    // Verify the password was hashed
    expect(userToUpdate.password).not.toBe(newPassword);

    // Verify the hashed password can be verified
    const isMatch = await userToUpdate.comparePassword(newPassword);
    expect(isMatch).toBe(true);
  });
});
