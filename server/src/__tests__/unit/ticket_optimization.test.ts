import { vi, describe, it, expect } from 'vitest';
import { getTickets } from '../../controllers/ticket.controller';
import { prisma } from '../../index';

// Mock Prisma
vi.mock('../../index', () => ({
  prisma: {
    ticket: {
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
    },
  },
}));

describe('Ticket Controller Optimization', () => {
  it('should select only necessary user fields in getTickets to avoid over-fetching sensitive data', async () => {
    const req = {
      query: { page: '1', limit: '10' },
      user: { role: 'ADMIN', id: 'admin-id' }
    } as any;

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as any;

    await getTickets(req, res);

    const findManyCall = (prisma.ticket.findMany as any).mock.calls[0][0];

    // Check if include.assignee has a 'select' property
    // If it is just `true`, this will be undefined
    expect(findManyCall.include?.assignee).toHaveProperty('select');

    // Check if include.creator has a 'select' property
    expect(findManyCall.include?.creator).toHaveProperty('select');

    // Verify specific fields are selected in the 'select' object
    // This ensures we are whitelisting, not blacklisting
    const assigneeSelect = findManyCall.include.assignee.select;
    expect(assigneeSelect).toHaveProperty('id', true);
    expect(assigneeSelect).toHaveProperty('name', true);
    expect(assigneeSelect).toHaveProperty('email', true);
    expect(assigneeSelect).not.toHaveProperty('password');
    expect(assigneeSelect).not.toHaveProperty('twoFactorSecret');
  });
});
