import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTickets, getTicketById } from "../../controllers/ticket.controller";
import { prisma } from "../../index";
import { Request, Response } from "express";

// Mock prisma
vi.mock("../../index", () => ({
  prisma: {
    ticket: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe("Ticket Controller Optimization", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: any;
  let status: any;

  const userSafeSelect = {
    id: true,
    name: true,
    email: true,
    avatar: true,
    role: true,
  };

  beforeEach(() => {
    json = vi.fn();
    status = vi.fn().mockReturnValue({ json });
    req = {
      query: {},
      params: {},
      user: { id: "user-1", role: "ADMIN" } as any,
    } as any;
    res = {
      json,
      status,
    };
    vi.clearAllMocks();
  });

  it("getTickets should select only safe user fields for assignee and creator", async () => {
    (prisma.ticket.findMany as any).mockResolvedValue([]);
    (prisma.ticket.count as any).mockResolvedValue(0);

    await getTickets(req as Request, res as Response);

    expect(prisma.ticket.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          assignee: { select: userSafeSelect },
          creator: { select: userSafeSelect },
        }),
      })
    );
  });

  it("getTicketById should select only safe user fields", async () => {
    req.params = { id: "ticket-1" };
    (prisma.ticket.findUnique as any).mockResolvedValue({
      id: "ticket-1",
      creatorId: "user-2",
      messages: [],
      attachments: []
    });

    await getTicketById(req as Request, res as Response);

    expect(prisma.ticket.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          assignee: { select: userSafeSelect },
          creator: { select: userSafeSelect },
          messages: {
            include: {
              sender: { select: userSafeSelect }
            },
            orderBy: { createdAt: "asc" }
          }
        }),
      })
    );
  });
});
