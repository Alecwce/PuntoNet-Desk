import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = vi.hoisted(() => ({
  ticket: {
    create: vi.fn(),
  },
  user: {
    findMany: vi.fn(),
  },
  notification: {
    create: vi.fn(),
    createMany: vi.fn(),
  },
}));

vi.mock('../../index', () => ({
  prisma: mockPrisma,
}));

import { createTicket } from '../../controllers/ticket.controller';
import { Request, Response } from 'express';

describe('Ticket Controller - createTicket', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: any;
  let status: any;

  beforeEach(() => {
    vi.clearAllMocks();
    json = vi.fn();
    status = vi.fn().mockReturnValue({ json });
    req = {
      body: {
        subject: 'Test Ticket',
        description: 'Test Description',
        priority: 'HIGH',
      },
      user: {
        id: 'user-1',
        name: 'Test User',
        role: 'CLIENT',
      },
    } as any;
    res = {
      status,
      json,
    } as any;
  });

  it('should create a ticket and batch notifications to admins (Optimized)', async () => {
    // 1. Mock ticket creation
    mockPrisma.ticket.create.mockResolvedValue({
      id: 'ticket-1',
      subject: 'Test Ticket',
      creatorId: 'user-1',
      status: 'OPEN',
    });

    // 2. Mock admins finding - Return 3 admins
    mockPrisma.user.findMany.mockResolvedValue([
      { id: 'admin-1' },
      { id: 'admin-2' },
      { id: 'agent-1' },
    ]);

    // 3. Mock notification creation
    mockPrisma.notification.createMany.mockResolvedValue({ count: 3 });

    // 4. Call Controller
    await createTicket(req as Request, res as Response);

    // 5. Assertions
    expect(mockPrisma.ticket.create).toHaveBeenCalled();
    expect(mockPrisma.user.findMany).toHaveBeenCalled();

    // Verify Batching: notifyMany calls prisma.notification.createMany once
    expect(mockPrisma.notification.createMany).toHaveBeenCalledTimes(1);

    // Ensure create is NOT called
    expect(mockPrisma.notification.create).not.toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'ticket-1' }));
  });
});
