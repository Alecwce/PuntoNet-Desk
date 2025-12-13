import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../index"; // Assuming index.ts exports app

describe("Health Check Integration", () => {
  it("should return 200 and healthy status", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "healthy");
  });

  it("should return CORS origins in dev/prod accordingly", async () => {
    const response = await request(app).get("/health");
    expect(response.body).toHaveProperty("cors_origins");
    expect(Array.isArray(response.body.cors_origins)).toBe(true);
  });
});
