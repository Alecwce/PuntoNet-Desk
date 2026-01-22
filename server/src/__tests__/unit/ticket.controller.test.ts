import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Request, Response } from 'express';

// Mock dependencies BEFORE importing the controller
vi.mock('../../index', () => ({
  prisma: {
    ticket: {
      create: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
    },
    notification: {
      createMany: vi.fn(),
    }
  }
}));

vi.mock('../../controllers/notification.controller', () => ({
  notify: vi.fn(),
  notifyMany: vi.fn(),
}));

import { createTicket } from '../../controllers/ticket.controller';
import { prisma } from '../../index';
import { notify, notifyMany } from '../../controllers/notification.controller';

describe('Ticket Controller - createTicket', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: any;
  let status: any;

  beforeEach(() => {
    json = vi.fn();
    status = vi.fn().mockReturnValue({ json });
    res = { status, json };
    req = {
      body: {
        subject: 'Test Ticket',
        description: 'Test Description',
        priority: 'HIGH'
      },
      user: {
        id: 'user-1',
        name: 'Test User',
        role: 'CLIENT'
      }
    } as any;

    vi.clearAllMocks();
  });

  it('should create a ticket and send batch notifications to staff', async () => {
    // Mock Prisma responses
    (prisma.ticket.create as any).mockResolvedValue({
      id: 'ticket-1',
      subject: 'Test Ticket',
      creatorId: 'user-1'
    });

    (prisma.user.findMany as any).mockResolvedValue([
      { id: 'admin-1', role: 'ADMIN' },
      { id: 'agent-1', role: 'AGENT' },
      { id: 'user-1', role: 'CLIENT' } // Should be filtered out if returned
    ]);

    await createTicket(req as Request, res as Response);

    // Verify ticket creation
    expect(prisma.ticket.create).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      id: 'ticket-1'
    }));

    // Verify notifications
    // This expects the OPTIMIZED behavior
    expect(notifyMany).toHaveBeenCalledTimes(1);
    expect(notifyMany).toHaveBeenCalledWith(
      ['admin-1', 'agent-1'], // user-1 is excluded
      'Nuevo Ticket',
      expect.stringContaining('Ticket #Test Ticket creado por Test User'),
      'INFO'
    );

    // Ensure legacy notify is NOT called (optimization verification)
    expect(notify).not.toHaveBeenCalled();
  });
});
