import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import App from '../App';
import api from '../lib/api';

// Mock API
vi.mock('../lib/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/api')>();
  const mockGet = vi.fn();

  return {
    ...actual,
    default: {
      ...actual.default,
      get: mockGet,
      post: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
    fetchCsrfToken: vi.fn().mockResolvedValue(undefined),
  };
});

// Mock Canvas Confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock MainLayout
vi.mock('../components/MainLayout', () => ({
  MainLayout: ({ children }: any) => <div data-testid="main-layout">{children}</div>,
}));

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock localStorage
    const store: Record<string, string> = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'user') {
        return JSON.stringify({ id: '1', role: 'ADMIN', name: 'Test User', email: 'test@example.com' });
      }
      return store[key] || null;
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      store[key] = value.toString();
    });

    // Mock API implementations
    (api.get as any).mockImplementation((url: string) => {
        if (url.includes('/reports/stats')) {
            return Promise.resolve({
                data: {
                    tickets: { total: 10, open: 5, inProgress: 3, resolved: 2, critical: 1 }
                }
            });
        }
        // Default list response for tickets
        return Promise.resolve({
            data: {
                data: [],
                meta: { total: 0, totalPages: 1, page: 1 }
            }
        });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches tickets ONLY ONCE when navigating to /tickets (optimized)', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );

    // Wait for Dashboard "Ver todos" button
    const link = await screen.findByText('Ver todos', {}, { timeout: 3000 });

    // Clear mocks before navigation
    (api.get as any).mockClear();

    // Click navigation
    fireEvent.click(link);

    // Wait for TicketList header
    const header = await screen.findByText('Gestión de Tickets');
    expect(header).toBeInTheDocument();

    // Wait for debounce (500ms) + buffer
    await act(async () => {
        await new Promise(r => setTimeout(r, 800));
    });

    // Check calls to api.get
    const getMock = api.get as unknown as ReturnType<typeof vi.fn>;
    const calls = getMock.mock.calls;

    console.log('API GET Calls:', calls.map(c => ({ url: c[0], params: c[1] })));

    // We expect:
    // 1. Call from App.tsx: "/tickets?limit=5" -> SHOULD NOT HAPPEN (Removed)
    // 2. Call from TicketList.tsx: "/tickets" -> SHOULD HAPPEN

    const appCall = calls.find(call => call[0] === '/tickets?limit=5');
    const ticketListCall = calls.find(call => call[0] === '/tickets' && call[1]?.params);

    expect(appCall).toBeUndefined(); // Optimization verified!
    expect(ticketListCall).toBeDefined();

    expect(calls.length).toBe(1);
  });
});
