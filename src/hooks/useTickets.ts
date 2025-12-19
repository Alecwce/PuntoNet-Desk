import { useState, useCallback, useEffect } from "react";
import api from "../lib/api";
import { Ticket } from "../types";

interface UseTicketsFilters {
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
}

export const useTickets = (initialFilters: UseTicketsFilters = {}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page };
      // Just add params if they have value and are not "all"
      if (filters.limit) params.limit = filters.limit;
      if (filters.search) params.search = filters.search;
      if (filters.status && filters.status !== "all")
        params.status = filters.status;
      if (filters.priority && filters.priority !== "all")
        params.priority = filters.priority;

      const response = await api.get("/tickets", { params });
      setTickets(response.data.data || []);

      if (response.data.meta) {
        setTotalPages(response.data.meta.totalPages);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
      // You might want to set an error state here to show a UI message
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      // Reset page to 1 when filters change (except page itself, but page is not in filters object)
      if (page !== 1 && filters !== initialFilters) {
        // Logic to reset page on filter change could be complex inside effect.
        // For simplicity, we just fetch. Ideally, setFilters should reset page.
      }
      fetchTickets();
    }, 500); // Wait 500ms after last change

    return () => clearTimeout(timer);
  }, [filters, page, fetchTickets]);

  const updateFilters = (newFilters: Partial<UseTicketsFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to page 1 when filters change
  };

  return {
    tickets,
    loading,
    refetch: fetchTickets,
    setFilters: updateFilters,
    filters,
    page,
    setPage,
    totalPages,
  };
};
