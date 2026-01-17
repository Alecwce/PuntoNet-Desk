import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDashboardStats } from "../../controllers/reports.controller";
import { prisma } from "../../index";
import { Request, Response } from "express";

// Mock the prisma client
vi.mock("../../index", () => ({
  prisma: {
    ticket: {
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    user: {
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    knowledgeBase: {
      count: vi.fn(),
    },
  },
}));

describe("Reports Controller - getDashboardStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return dashboard stats with correct structure (Optimized)", async () => {
    // Setup mocks for groupBy - optimized implementation
    const groupByTicketMock = prisma.ticket.groupBy as any;
    groupByTicketMock.mockResolvedValue([
      { status: "OPEN", _count: { id: 50 } },
      { status: "IN_PROGRESS", _count: { id: 20 } },
      { status: "RESOLVED", _count: { id: 20 } },
      { status: "CLOSED", _count: { id: 10 } },
    ]);

    const groupByUserMock = prisma.user.groupBy as any;
    groupByUserMock.mockResolvedValue([
      { role: "CLIENT", _count: { id: 180 } },
      { role: "AGENT", _count: { id: 20 } },
      // ADMIN implied if present, but total relies on sum
    ]);

    (prisma.knowledgeBase.count as any).mockResolvedValue(15); // totalKBArticles
    (prisma.ticket.count as any).mockResolvedValue(5); // criticalTickets (still uses count)

    const req = { query: {} } as unknown as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;

    await getDashboardStats(req, res);

    expect(res.json).toHaveBeenCalledWith({
      tickets: {
        total: 100, // 50+20+20+10
        open: 50,
        inProgress: 20,
        resolved: 20,
        closed: 10,
        critical: 5,
      },
      users: {
        total: 200, // 180+20
        clients: 180,
        agents: 20,
      },
      knowledgeBase: {
        published: 15,
      },
    });

    // Verify that we are indeed using groupBy instead of multiple counts
    expect(prisma.ticket.groupBy).toHaveBeenCalledTimes(1);
    expect(prisma.user.groupBy).toHaveBeenCalledTimes(1);
  });
});
