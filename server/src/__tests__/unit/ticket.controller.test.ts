import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTicket } from '../../controllers/ticket.controller';
import { prisma } from '../../index';
import * as notificationController from '../../controllers/notification.controller';

// Mock Prisma
vi.mock('../../index', () => ({
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
vi.mock('../../controllers/notification.controller', () => ({
  notify: vi.fn(),
  notifyMany: vi.fn(),
}));

describe('Ticket Controller - createTicket', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      body: {
        subject: 'Test Ticket',
        description: 'Test Description',
        priority: 'HIGH',
      },
      user: {
        id: 'user-1',
        name: 'Test User',
      },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it('should call notifyMany once (optimized behavior)', async () => {
    // Setup Mock Data
    const mockTicket = {
      id: 'ticket-1',
      subject: 'Test Ticket',
      creatorId: 'user-1',
    };
    (prisma.ticket.create as any).mockResolvedValue(mockTicket);

    const mockStaff = [
      { id: 'admin-1' },
      { id: 'agent-1' },
      { id: 'agent-2' },
      { id: 'user-1' }, // Current user (should be filtered out)
    ];
    (prisma.user.findMany as any).mockResolvedValue(mockStaff);

    // Call Controller
    await createTicket(req, res);

    // Assertions
    expect(prisma.ticket.create).toHaveBeenCalled();
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { role: { in: ['ADMIN', 'AGENT'] } },
      select: { id: true },
    });

    // Verify N+1 Optimization
    expect(notificationController.notify).not.toHaveBeenCalled(); // Should NOT call single notify
    expect(notificationController.notifyMany).toHaveBeenCalledTimes(1);

    // Check arguments
    expect(notificationController.notifyMany).toHaveBeenCalledWith(
      ['admin-1', 'agent-1', 'agent-2'], // user-1 filtered out
      'Nuevo Ticket',
      expect.stringContaining('Ticket #Test Ticket'),
      'INFO'
    );
  });
});
