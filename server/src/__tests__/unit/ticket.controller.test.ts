import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTickets, getTicketById } from '../../controllers/ticket.controller';
import { prisma } from '../../index';
import { Request, Response } from 'express';

// Mock Prisma
vi.mock('../../index', () => ({
  prisma: {
    ticket: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    message: {
        create: vi.fn(),
        deleteMany: vi.fn(),
    },
    attachment: {
        deleteMany: vi.fn(),
    },
    user: {
        findMany: vi.fn(),
    }
  },
}));

describe('Ticket Controller Optimization Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const userSafeSelect = {
    id: true,
    name: true,
    email: true,
    avatar: true,
    role: true,
  };

  it('getTickets should select only safe user fields', async () => {
    const req = {
      query: {},
      user: { role: 'ADMIN', id: 'admin-id' }
    } as unknown as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;

    (prisma.ticket.findMany as any).mockResolvedValue([]);
    (prisma.ticket.count as any).mockResolvedValue(0);

    await getTickets(req, res);

    const findManyCalls = (prisma.ticket.findMany as any).mock.calls;
    expect(findManyCalls.length).toBe(1);
    const args = findManyCalls[0][0];

    // Verify include structure uses select for optimization
    expect(args.include.assignee).toEqual({ select: userSafeSelect });
    expect(args.include.creator).toEqual({ select: userSafeSelect });
  });

  it('getTicketById should select only safe user fields including nested messages', async () => {
    const req = {
      params: { id: 'ticket-123' },
      user: { role: 'ADMIN', id: 'admin-id' }
    } as unknown as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;

    (prisma.ticket.findUnique as any).mockResolvedValue({
        id: 'ticket-123',
        creatorId: 'creator-id',
        assigneeId: 'assignee-id'
    });

    await getTicketById(req, res);

    const findUniqueCalls = (prisma.ticket.findUnique as any).mock.calls;
    expect(findUniqueCalls.length).toBe(1);
    const args = findUniqueCalls[0][0];

    // Verify include structure uses select for optimization
    expect(args.include.assignee).toEqual({ select: userSafeSelect });
    expect(args.include.creator).toEqual({ select: userSafeSelect });
    // Verify nested message sender optimization
    expect(args.include.messages.include.sender).toEqual({ select: userSafeSelect });
  });
});
