const mongoose = require("mongoose");
const User = require("../src/models/userModel");

// Import setup to configure environment and MongoDB
require("./setup.js");

describe("User Model", () => {
  let user;

  afterEach(async () => {
    if (user && user._id) {
      await User.deleteOne({ _id: user._id });
    }
  });

  it("should encrypt password on save", async () => {
    user = new User({
      name: "Test User",
      email: `test-${Date.now()}@example.com`,
      password: "password123",
    });

    await user.save();

    expect(user.password).not.toBe("password123");
    expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/);
  });

  it("should compare passwords correctly", async () => {
    const plainPassword = "password123";
    user = new User({
      name: "Test User",
      email: "test@example.com",
      password: plainPassword,
    });

    await user.save();

    // Should return true for correct password
    const isMatch = await user.comparePassword(plainPassword);
    expect(isMatch).toBe(true);

    // Should return false for incorrect password
    const isNotMatch = await user.comparePassword("wrongpassword");
    expect(isNotMatch).toBe(false);
  });

  it("should hash password on update", async () => {
    // First create a user
    user = new User({
      name: "Update Test User",
      email: `update-test-${Date.now()}@example.com`,
      password: "oldpassword123",
    });
    await user.save();

    const newPassword = "newpassword123";

    // Find the user fresh from the database
    const userToUpdate = await User.findById(user._id);
    userToUpdate.password = newPassword;
    await userToUpdate.save();

    // Verify the password was hashed
    expect(userToUpdate.password).not.toBe(newPassword);

    // Verify the hashed password can be verified
    const isMatch = await userToUpdate.comparePassword(newPassword);
    expect(isMatch).toBe(true);
  });
});
