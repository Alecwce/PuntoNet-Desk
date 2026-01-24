import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTicket } from "../../controllers/ticket.controller";
import { prisma } from "../../index";
import * as notificationController from "../../controllers/notification.controller";
import { Request, Response } from "express";

// Mock Prisma
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

// Mock Notification Controller
vi.mock("../../controllers/notification.controller", async () => {
  const actual = await vi.importActual<typeof import("../../controllers/notification.controller")>("../../controllers/notification.controller");
  return {
    ...actual,
    notify: vi.fn(),
    notifyMany: vi.fn(),
  };
});

describe("Ticket Controller - createTicket", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: any;
  let status: any;

  beforeEach(() => {
    json = vi.fn();
    status = vi.fn().mockReturnValue({ json });
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
      } as any,
    };
    res = {
      json,
      status,
    };
    vi.clearAllMocks();
  });

  it("should create a ticket and notify staff using notifyMany", async () => {
    // Mock created ticket
    const mockTicket = {
      id: "ticket-id",
      subject: "Test Ticket",
      description: "Test Description",
      priority: "HIGH",
      creatorId: "creator-id",
      status: "OPEN",
    };

    (prisma.ticket.create as any).mockResolvedValue(mockTicket);

    // Mock staff
    const mockStaff = [
      { id: "staff-1" },
      { id: "staff-2" },
      { id: "creator-id" }, // This should be filtered out
    ];
    (prisma.user.findMany as any).mockResolvedValue(mockStaff);

    // Mock notifyMany
    const notifyManySpy = vi.spyOn(notificationController, "notifyMany");

    await createTicket(req as Request, res as Response);

    // Verify ticket creation
    expect(prisma.ticket.create).toHaveBeenCalledWith({
      data: {
        subject: "Test Ticket",
        description: "Test Description",
        priority: "HIGH",
        creatorId: "creator-id",
        status: "OPEN",
      },
      include: { assignee: true, creator: true },
    });

    // Verify response
    expect(json).toHaveBeenCalledWith(mockTicket);

    // Verify notifyMany was called with filtered staff IDs
    expect(notifyManySpy).toHaveBeenCalledWith(
      ["staff-1", "staff-2"], // creator-id should be excluded
      "Nuevo Ticket",
      expect.stringContaining("Ticket #Test Ticket creado por Creator"),
      "INFO"
    );
  });
});
