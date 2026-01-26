import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTicket } from "../../controllers/ticket.controller";
import { prisma } from "../../index";
import * as notificationController from "../../controllers/notification.controller";

// Mock Prisma
vi.mock("../../index", () => ({
  prisma: {
    ticket: {
      create: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
    },
  },
}));

// Mock Notification Controller
vi.mock("../../controllers/notification.controller", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../controllers/notification.controller")>();
  return {
    ...actual,
    notifyMany: vi.fn(),
  };
});

describe("Ticket Controller - createTicket", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {
        subject: "Test Ticket",
        description: "Test Description",
        priority: "HIGH",
      },
      user: {
        id: "user-123",
        name: "Test User",
        role: "CLIENT",
      },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    vi.clearAllMocks();
  });

  it("should create a ticket and notify admins using notifyMany", async () => {
    // Mock Prisma responses
    const mockTicket = {
      id: "ticket-1",
      subject: "Test Ticket",
      creatorId: "user-123",
    };
    (prisma.ticket.create as any).mockResolvedValue(mockTicket);

    const mockStaff = [
      { id: "admin-1" },
      { id: "agent-1" },
      { id: "user-123" }, // Should be filtered out
    ];
    (prisma.user.findMany as any).mockResolvedValue(mockStaff);

    await createTicket(req, res);

    // Verify ticket creation
    expect(prisma.ticket.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        subject: "Test Ticket",
        creatorId: "user-123",
      }),
    }));

    // Verify notifyMany called
    expect(notificationController.notifyMany).toHaveBeenCalledTimes(1);
    expect(notificationController.notifyMany).toHaveBeenCalledWith(
      ["admin-1", "agent-1"], // user-123 filtered out
      "Nuevo Ticket",
      expect.stringContaining("Test Ticket"),
      "INFO"
    );

    // Verify response
    expect(res.json).toHaveBeenCalledWith(mockTicket);
  });
});
