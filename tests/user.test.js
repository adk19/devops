const request = require("supertest");
const Mongoose = require("mongoose");

// Import setup to configure environment and MongoDB
require("./setup.js");

const app = require("../src/app.js");
const User = require("../src/models/userModel.js");

describe("User API", () => {
  describe("POST /api/user", () => {
    it("should create a new user", async () => {
      const user = {
        name: "John Doe",
        email: "john@test.com",
        password: "pass@123",
      };

      const res = await request(app).post("/api/user").send(user).expect(201);

      expect(res.body.status).toBe(true);
      expect(res.body.data).toHaveProperty("_id");
      expect(res.body.data.email).toBe(user.email.toLowerCase());
      expect(res.body.data.name).toBe(user.name);
    });

    it("should not create user with duplicate email", async () => {
      const userData = {
        name: "John Doe",
        email: "duplicate@test.com",
        password: "pass@123",
      };

      // First create a user
      const firstResponse = await request(app).post("/api/user").send(userData);
      console.log("First user created:", firstResponse.status, firstResponse.body);

      // Check if user exists in database
      const User = require("../src/models/userModel.js");
      const existingUser = await User.findOne({ email: userData.email });
      console.log("User exists in DB:", !!existingUser, existingUser?._id);

      // Try to create user with same email again
      const duplicateResponse = await request(app).post("/api/user").send(userData);
      console.log("Duplicate attempt:", duplicateResponse.status, duplicateResponse.body);

      // Check the error response format
      expect(duplicateResponse.status).toBe(400);
    });

    it("should fail with missing required fields", async () => {
      const res = await request(app)
        .post("/api/user")
        .send({ name: "Incomplete" })
        .expect(400);

      expect(res.body.status).toBe(false);
      expect(res.body.error).toContain("is required");
    });
  });

  describe("PATCH /api/user/:id", () => {
    it("should update a user.", async () => {
      const updates = {
        name: "Update john",
        email: "update@test.com",
      };
      // First Create User
      let testUser = await request(app).post("/api/user").send({
        name: "jay veru",
        email: "test@gamil.com",
        password: "test@123",
      });
      const res = await request(app)
        .patch(`/api/user/${testUser.body.data._id}`)
        .send(updates);

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual(true);
      expect(res.body.data).toHaveProperty("_id");
      expect(res.body.data.email).toBe(updates.email.toLowerCase());
      expect(res.body.data.name).toBe(updates.name);
    });

    it("should update password when provided", async () => {
      const updates = { password: "newPassword123" };

      const testUser = await request(app).post("/api/user").send({
        name: "jay veru",
        email: "test@gamil.com",
        password: "test@123",
      });
      const res = await request(app)
        .patch(`/api/user/${testUser.body.data._id}`)
        .send(updates);

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe(true);
    });

    it("should return 404 for non-existent user", async () => {
      const nonExistentId = new Mongoose.Types.ObjectId();
      const res = await request(app)
        .patch(`/api/user/${nonExistentId}`)
        .send({ name: "No One" });

      expect(res.statusCode).toEqual(404);
    });
  });

  // describe("GET /api/user/list", () => {
  //   it("should return a list of users", async () => {
  //     await User.create({
  //       name: "Test User",
  //       email: "test@example.com",
  //       password: "password123",
  //     });

  //     const res = await request(app).get("/api/user/list");

  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body.status).toBe(true);
  //     expect(Array.isArray(res.body.data)).toBe(true);
  //   });
  // });

  describe("GET /api/user/:id", () => {
    it("should return a single user by ID", async () => {
      let testUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      const res = await request(app).get(`/api/user/${testUser._id}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data._id).toBe(testUser._id.toString());
      expect(res.body.data.email).toBe("test@example.com");
    });

    it("should return 404 for non-existent user ID", async () => {
      const nonExistentId = new Mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/user/${nonExistentId}`);

      expect(res.statusCode).toEqual(404);
    });
  });

  describe("DELETE /api/user/id", () => {
    it("should delete an existing user", async () => {
      const userToDelete = await User.create({
        name: "To Be Deleted",
        email: "delete@test.com",
        password: "password123",
      });

      const res = await request(app).delete(`/api/user/${userToDelete._id}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe(true);

      // Verify user is deleted
      const deletedUser = await User.findById(userToDelete._id);
      expect(deletedUser).toBeNull();
    });

    it("should return 404 when trying to delete non-existent user", async () => {
      const nonExistentId = new Mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/user/${nonExistentId}`);

      expect(res.statusCode).toEqual(404);
    });
  });
});
