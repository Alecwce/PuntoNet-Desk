import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response } from "express";

// Hoisted mock to avoid ReferenceError
const prismaMock = vi.hoisted(() => ({
  ticket: {
    create: vi.fn(),
  },
  user: {
    findMany: vi.fn(),
  },
  notification: {
    createMany: vi.fn(),
  },
}));

vi.mock("../../index", () => ({
  prisma: prismaMock,
}));

// Import controller AFTER mocking
import { createTicket } from "../../controllers/ticket.controller";

describe("Ticket Controller - createTicket", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      body: {
        subject: "Test Ticket",
        description: "Test Description",
        priority: "HIGH",
      },
      user: {
        id: "creator-id",
        name: "Creator",
        role: "CLIENT",
      },
    } as any;

    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as any;
  });

  it("should create a ticket and batch notify admins", async () => {
    // Mock created ticket
    const createdTicket = {
      id: "ticket-1",
      subject: "Test Ticket",
      description: "Test Description",
      priority: "HIGH",
      creatorId: "creator-id",
      status: "OPEN",
    };
    prismaMock.ticket.create.mockResolvedValue(createdTicket);

    // Mock admins
    const admins = [
      { id: "admin-1" },
      { id: "admin-2" },
      { id: "creator-id" }, // Should be filtered out
    ];
    prismaMock.user.findMany.mockResolvedValue(admins);

    // Mock notification creation
    prismaMock.notification.createMany.mockResolvedValue({ count: 2 });

    await createTicket(req as Request, res as Response);

    expect(prismaMock.ticket.create).toHaveBeenCalled();
    expect(prismaMock.user.findMany).toHaveBeenCalled();

    // Verify batch notification
    expect(prismaMock.notification.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ recipientId: "admin-1" }),
        expect.objectContaining({ recipientId: "admin-2" }),
      ]),
    });

    // Ensure creator is not notified
    // We check the first call argument
    const calls = prismaMock.notification.createMany.mock.calls[0][0].data;
    const recipientIds = calls.map((n: any) => n.recipientId);
    expect(recipientIds).not.toContain("creator-id");

    expect(res.json).toHaveBeenCalledWith(createdTicket);
  });
});
