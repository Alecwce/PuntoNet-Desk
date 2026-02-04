import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response } from "express";

// Use vi.hoisted to ensure mockPrisma is available for the hoisted vi.mock call
const { mockPrisma } = vi.hoisted(() => {
  return {
    mockPrisma: {
      ticket: {
        create: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      user: {
        findMany: vi.fn(),
      },
      notification: {
        create: vi.fn(),
        createMany: vi.fn(),
      },
      attachment: {
        deleteMany: vi.fn(),
      },
      message: {
        deleteMany: vi.fn(),
      },
    },
  };
});

vi.mock("../../index", () => ({
  prisma: mockPrisma,
}));

// Import controller AFTER mocking
import { createTicket } from "../../controllers/ticket.controller";

describe("Ticket Controller - createTicket", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: any;
  let status: any;

  beforeEach(() => {
    vi.clearAllMocks();
    json = vi.fn();
    status = vi.fn().mockReturnValue({ json });
    res = { json, status };
    req = {
      body: {
        subject: "Test Ticket",
        description: "Test Description",
        priority: "HIGH",
      },
      user: {
        id: "user-1",
        name: "Test User",
        role: "CLIENT",
      },
    } as any;
  });

  it("should create a ticket and notify admins", async () => {
    // Mock created ticket
    mockPrisma.ticket.create.mockResolvedValue({
      id: "ticket-1",
      subject: "Test Ticket",
      creatorId: "user-1",
      status: "OPEN",
    });

    // Mock staff: 2 admins + the creator (who shouldn't be notified)
    mockPrisma.user.findMany.mockResolvedValue([
      { id: "admin-1" },
      { id: "admin-2" },
      { id: "user-1" },
    ]);

    mockPrisma.notification.createMany.mockResolvedValue({ count: 2 });

    await createTicket(req as Request, res as Response);

    // 1. Verify ticket creation
    expect(mockPrisma.ticket.create).toHaveBeenCalled();

    // 2. Verify response
    expect(json).toHaveBeenCalledWith(expect.objectContaining({
      id: "ticket-1",
    }));

    // 3. Verify notifications
    // Optimized behavior: createMany should be called once
    expect(mockPrisma.notification.create).not.toHaveBeenCalled();
    expect(mockPrisma.notification.createMany).toHaveBeenCalledTimes(1);

    expect(mockPrisma.notification.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ recipientId: "admin-1" }),
        expect.objectContaining({ recipientId: "admin-2" }),
      ]),
    });
  });
});
