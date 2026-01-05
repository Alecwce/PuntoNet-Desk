import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDashboardStats } from '../../controllers/reports.controller';
import { prisma } from '../../index';
import { Request, Response } from 'express';

// Mock prisma
vi.mock('../../index', () => ({
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

describe('Reports Controller - getDashboardStats', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: any;
  let status: any;

  beforeEach(() => {
    req = {
      query: {},
    };
    json = vi.fn();
    status = vi.fn().mockReturnValue({ json });
    res = {
      json,
      status,
    };
    vi.clearAllMocks();
  });

  it('should return dashboard stats correctly using groupBy optimization', async () => {
    // Mock groupBy for tickets
    // Returns array of { status: 'OPEN', priority: 'LOW', _count: { id: 5 } }
    const ticketGroups = [
      { status: 'OPEN', priority: 'MEDIUM', _count: { id: 10 } },
      { status: 'IN_PROGRESS', priority: 'HIGH', _count: { id: 5 } },
      { status: 'RESOLVED', priority: 'LOW', _count: { id: 8 } },
      { status: 'CLOSED', priority: 'MEDIUM', _count: { id: 20 } },
      { status: 'OPEN', priority: 'CRITICAL', _count: { id: 2 } }, // Critical ticket
    ];
    (prisma.ticket.groupBy as any).mockResolvedValue(ticketGroups);

    // Mock groupBy for users
    const userGroups = [
      { role: 'CLIENT', _count: { id: 100 } },
      { role: 'AGENT', _count: { id: 10 } },
      { role: 'ADMIN', _count: { id: 2 } },
    ];
    (prisma.user.groupBy as any).mockResolvedValue(userGroups);

    // Mock KB count (kept as count query)
    (prisma.knowledgeBase.count as any).mockResolvedValue(15);

    await getDashboardStats(req as Request, res as Response);

    // Verify calls
    expect(prisma.ticket.groupBy).toHaveBeenCalledWith(expect.objectContaining({
      by: ['status', 'priority'],
    }));
    expect(prisma.user.groupBy).toHaveBeenCalledWith(expect.objectContaining({
      by: ['role'],
    }));

    // Verify response
    // Total tickets: 10 + 5 + 8 + 20 + 2 = 45
    // Open: 10 + 2 = 12
    // In Progress: 5
    // Resolved: 8
    // Closed: 20
    // Critical: 2 (from the CRITICAL priority entry)

    // Users:
    // Total: 100 + 10 + 2 = 112
    // Clients: 100
    // Agents: 10

    expect(json).toHaveBeenCalledWith({
      tickets: {
        total: 45,
        open: 12,
        inProgress: 5,
        resolved: 8,
        closed: 20,
        critical: 2,
      },
      users: {
        total: 112,
        clients: 100,
        agents: 10,
      },
      knowledgeBase: {
        published: 15,
      },
    });
  });

  it('should handle date filters', async () => {
    req.query = { startDate: '2023-01-01', endDate: '2023-01-31' };

    (prisma.ticket.groupBy as any).mockResolvedValue([]);
    (prisma.user.groupBy as any).mockResolvedValue([]);
    (prisma.knowledgeBase.count as any).mockResolvedValue(0);

    await getDashboardStats(req as Request, res as Response);

    expect(prisma.ticket.groupBy).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        createdAt: expect.any(Object),
      }),
    }));
  });
});
