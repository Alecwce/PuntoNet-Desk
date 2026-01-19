import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTicket } from '../../controllers/ticket.controller';
import { Request, Response } from 'express';
// Import the module we are mocking to access the mock instance
import { prisma } from '../../index';

// Hoisted mock definition
vi.mock('../../index', () => ({
  prisma: {
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
  },
}));

describe('Ticket Controller - createTicket Optimization', () => {
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
        priority: 'HIGH',
      },
      user: {
        id: 'user-1',
        role: 'CLIENT',
        name: 'Client User',
      } as any,
    };
    vi.clearAllMocks();
  });

  it('should create a ticket and send batch notifications using createMany', async () => {
    // Setup mocks using the imported prisma object (which is now a mock)
    // We need to cast it to any or a mock type to access mock methods like mockResolvedValue
    const prismaMock = prisma as any;

    prismaMock.ticket.create.mockResolvedValue({
      id: 'ticket-1',
      subject: 'Test Ticket',
      creatorId: 'user-1',
    });

    // Mock staff members who should receive notifications
    prismaMock.user.findMany.mockResolvedValue([
      { id: 'admin-1' },
      { id: 'agent-1' },
    ]);

    prismaMock.notification.createMany.mockResolvedValue({ count: 2 });

    // Call controller
    await createTicket(req as Request, res as Response);

    // Assertions
    expect(prismaMock.ticket.create).toHaveBeenCalled();

    // Verify optimization: createMany should be called ONCE
    expect(prismaMock.notification.createMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.notification.createMany).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.arrayContaining([
        expect.objectContaining({ recipientId: 'admin-1', title: 'Nuevo Ticket' }),
        expect.objectContaining({ recipientId: 'agent-1', title: 'Nuevo Ticket' }),
      ])
    }));

    // Verify optimization: create (single) should NOT be called
    expect(prismaMock.notification.create).not.toHaveBeenCalled();

    expect(json).toHaveBeenCalledWith(expect.objectContaining({ id: 'ticket-1' }));
  });
});
