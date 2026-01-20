import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTicket } from "../../controllers/ticket.controller";
import { prisma } from "../../index";
import { Request, Response } from "express";

// Mock prisma
vi.mock("../../index", () => ({
  prisma: {
    ticket: {
      create: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
    },
    notification: {
      createMany: vi.fn(),
    },
  },
}));

describe("Ticket Controller - createTicket Optimization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a ticket and batch notifications to staff using createMany", async () => {
    // Setup Request
    const req = {
      body: {
        subject: "Test Ticket",
        description: "Test Desc",
        priority: "HIGH",
      },
      user: { id: "user1", name: "Tester", role: "CLIENT" },
    } as unknown as Request;

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;

    // Mock Ticket Creation
    const mockTicket = { id: "t1", subject: "Test Ticket" };
    (prisma.ticket.create as any).mockResolvedValue(mockTicket);

    // Mock Staff Finding (Admins/Agents)
    // We include the creator in the staff list to verify filtering logic
    const mockStaff = [
      { id: "admin1" },
      { id: "agent1" },
      { id: "user1" }, // Current user, should be filtered out
    ];
    (prisma.user.findMany as any).mockResolvedValue(mockStaff);

    // Execute Controller
    await createTicket(req, res);

    // Assertions
    expect(prisma.ticket.create).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockTicket);

    // Verify Staff Fetch
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { role: { in: ["ADMIN", "AGENT"] } },
      select: { id: true },
    });

    // Verify OPTIMIZATION: createMany should be called exactly once
    expect(prisma.notification.createMany).toHaveBeenCalledTimes(1);

    // Verify Payload
    const createManyCallArgs = (prisma.notification.createMany as any).mock.calls[0][0];
    const data = createManyCallArgs.data;

    // Should contain 2 notifications (admin1, agent1)
    expect(data).toHaveLength(2);
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ recipientId: "admin1" }),
        expect.objectContaining({ recipientId: "agent1" }),
      ])
    );
    // Should NOT contain user1
    expect(data).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ recipientId: "user1" })])
    );
  });
});
