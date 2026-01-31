import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response } from "express";

// Define mocks before importing the module under test using vi.hoisted
const prismaMock = vi.hoisted(() => ({
  ticket: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },
  user: {
    findMany: vi.fn(),
  },
  notification: {
    createMany: vi.fn(),
  },
}));

// Mock ../index to return mocked prisma and avoid server start
vi.mock("../../index", () => ({
  prisma: prismaMock,
  app: {},
}));

import { createTicket } from "../../controllers/ticket.controller";

describe("Ticket Controller - createTicket", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: any;
  let statusMock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    jsonMock = vi.fn();
    statusMock = vi.fn(() => ({ json: jsonMock }));
    res = {
      status: statusMock,
      json: jsonMock,
    };
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

  it("should create a ticket and send batch notifications to admins", async () => {
    // Setup Mocks
    const createdTicket = {
      id: "ticket-1",
      subject: "Test Ticket",
      description: "Test Description",
      priority: "HIGH",
      creatorId: "user-1",
      status: "OPEN",
    };

    prismaMock.ticket.create.mockResolvedValue(createdTicket);

    const admins = [
      { id: "admin-1" },
      { id: "admin-2" },
      { id: "user-1" }, // Current user (should be filtered out)
    ];
    prismaMock.user.findMany.mockResolvedValue(admins);
    prismaMock.notification.createMany.mockResolvedValue({ count: 2 });

    // Execute
    await createTicket(req as Request, res as Response);

    // Verify Ticket Creation
    expect(prismaMock.ticket.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          subject: "Test Ticket",
          creatorId: "user-1",
        }),
      })
    );

    // Verify Notification Batching
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: { role: { in: ["ADMIN", "AGENT"] } },
      select: { id: true },
    });

    // Expect createMany to be called with correct data
    expect(prismaMock.notification.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ recipientId: "admin-1", title: "Nuevo Ticket" }),
        expect.objectContaining({ recipientId: "admin-2", title: "Nuevo Ticket" }),
      ]),
    });

    // Ensure it was called once, not in a loop
    expect(prismaMock.notification.createMany).toHaveBeenCalledTimes(1);

    // Ensure response
    expect(jsonMock).toHaveBeenCalledWith(createdTicket);
  });
});
