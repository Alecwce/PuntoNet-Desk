import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../index";
import { prisma } from "../../index";

describe("Auth Integration", () => {
  // Mock user data or seed before tests if necessary
  // For now, we test handling of invalid credentials securely

  it("should reject invalid login credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(404); // Or 401 depending on implementation
    expect(response.body).toHaveProperty("message");
  });

  it("should return 400 if email is missing", async () => {
    const response = await request(app).post("/api/auth/login").send({
      password: "password123",
    });
    expect(response.status).toBe(400);
  });
});
