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
vi.mock("../../controllers/notification.controller", () => ({
  notify: vi.fn(),
  notifyMany: vi.fn(),
}));

describe("Ticket Controller - createTicket Optimization", () => {
  let req: any;
  let res: any;

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
        name: "Creator Name",
        role: "CLIENT",
      },
    };
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
  });

  it("should create a ticket and use notifyMany for staff notifications", async () => {
    // Setup Mocks
    const mockTicket = {
      id: "ticket-id",
      subject: "Test Ticket",
      creatorId: "creator-id",
    };
    (prisma.ticket.create as any).mockResolvedValue(mockTicket);

    const mockStaff = [
      { id: "admin-1" },
      { id: "agent-1" },
      { id: "creator-id" }, // Should be filtered out
    ];
    (prisma.user.findMany as any).mockResolvedValue(mockStaff);

    // Execute
    await createTicket(req, res);

    // Verify Ticket Creation
    expect(prisma.ticket.create).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockTicket);

    // Verify Optimization: notifyMany called once with correct data
    expect(notificationController.notifyMany).toHaveBeenCalledTimes(1);

    // Verify payload excludes creator and includes others
    const expectedNotifications = [
      {
        recipientId: "admin-1",
        title: "Nuevo Ticket",
        message: expect.stringContaining("Test Ticket"),
        type: "INFO",
      },
      {
        recipientId: "agent-1",
        title: "Nuevo Ticket",
        message: expect.stringContaining("Test Ticket"),
        type: "INFO",
      },
    ];

    // Check that the first argument matches our expectation
    expect(notificationController.notifyMany).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ recipientId: "admin-1" }),
        expect.objectContaining({ recipientId: "agent-1" })
      ])
    );

    // Ensure creator is NOT in the list
    const actualCall = (notificationController.notifyMany as any).mock.calls[0][0];
    const recipientIds = actualCall.map((n: any) => n.recipientId);
    expect(recipientIds).not.toContain("creator-id");
    expect(recipientIds).toHaveLength(2);
  });
});
