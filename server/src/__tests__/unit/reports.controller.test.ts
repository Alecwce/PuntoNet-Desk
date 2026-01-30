import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDashboardStats } from '../../controllers/reports.controller';
import { Request, Response } from 'express';

// Mock the prisma client using vi.hoisted to allow access in vi.mock
const prismaMock = vi.hoisted(() => ({
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
}));

// Mock the entire index module
vi.mock('../../index', () => ({
  prisma: prismaMock,
}));

describe('Reports Controller - getDashboardStats', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: any;
  let status: any;

  beforeEach(() => {
    json = vi.fn();
    status = vi.fn().mockReturnValue({ json });
    req = {
      query: {},
    };
    res = {
      json,
      status,
    };
    vi.clearAllMocks();
  });

  it('should return dashboard stats correctly', async () => {
    // Setup return values for the optimized version (groupBy)
    // Order in Promise.all:
    // 1. ticket.groupBy (status)
    // 2. user.groupBy (role)
    // 3. user.count (total)
    // 4. kb.count (published)
    // 5. ticket.count (critical)

    // 1. ticket.groupBy (status)
    prismaMock.ticket.groupBy.mockResolvedValueOnce([
      { status: 'OPEN', _count: { id: 50 } },
      { status: 'IN_PROGRESS', _count: { id: 20 } },
      { status: 'RESOLVED', _count: { id: 20 } },
      { status: 'CLOSED', _count: { id: 10 } },
    ]);

    // 2. user.groupBy (role)
    prismaMock.user.groupBy.mockResolvedValueOnce([
      { role: 'CLIENT', _count: { id: 180 } },
      { role: 'AGENT', _count: { id: 20 } },
    ]);

    // 3. user.count (total)
    prismaMock.user.count.mockResolvedValueOnce(200);

    // 4. kb.count (published)
    prismaMock.knowledgeBase.count.mockResolvedValueOnce(15);

    // 5. ticket.count (critical)
    prismaMock.ticket.count.mockResolvedValueOnce(5);

    await getDashboardStats(req as Request, res as Response);

    expect(json).toHaveBeenCalledWith({
      tickets: {
        total: 100, // 50+20+20+10
        open: 50,
        inProgress: 20,
        resolved: 20,
        closed: 10,
        critical: 5,
      },
      users: {
        total: 200,
        clients: 180,
        agents: 20,
      },
      knowledgeBase: {
        published: 15,
      },
    });
  });
});
