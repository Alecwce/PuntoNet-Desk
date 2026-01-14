import { vi, describe, it, expect } from 'vitest';
import { getTickets, getTicketById } from '../../controllers/ticket.controller';
import { prisma } from '../../index';

// Mock the prisma client
vi.mock('../../index', () => ({
  prisma: {
    ticket: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

// Mock notifications to avoid side effects
vi.mock('../../controllers/notification.controller', () => ({
  notify: vi.fn(),
}));

describe('Ticket Controller Payload Optimization', () => {
  const userSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    avatar: true,
  };

  it('getTickets should select specific user fields', async () => {
    // Mock request and response
    const req = {
      query: {},
      user: { role: 'ADMIN', id: 'admin-id' },
    } as any;

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as any;

    // Mock prisma return
    (prisma.ticket.findMany as any).mockResolvedValue([]);
    (prisma.ticket.count as any).mockResolvedValue(0);

    await getTickets(req, res);

    expect(prisma.ticket.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: {
          assignee: { select: userSelect },
          creator: { select: userSelect },
        },
      })
    );
  });

  it('getTicketById should select specific user fields and safe sender fields', async () => {
    const req = {
      params: { id: 'ticket-id' },
      user: { role: 'ADMIN', id: 'admin-id' },
    } as any;

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as any;

    (prisma.ticket.findUnique as any).mockResolvedValue({ id: 'ticket-id' });

    await getTicketById(req, res);

    expect(prisma.ticket.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        include: {
          assignee: { select: userSelect },
          creator: { select: userSelect },
          messages: {
            include: { sender: { select: userSelect } },
            orderBy: { createdAt: "asc" },
          },
          attachments: true,
        },
      })
    );
  });
});
