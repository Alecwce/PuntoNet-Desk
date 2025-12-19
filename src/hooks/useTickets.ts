import { useState, useCallback, useEffect } from "react";
import api from "../lib/api";
import { Ticket } from "../types";
import { MOCK_TICKETS } from "../constants";

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

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      // Just add params if they have value and are not "all"
      if (filters.limit) params.limit = filters.limit;
      if (filters.search) params.search = filters.search;
      if (filters.status && filters.status !== "all")
        params.status = filters.status;
      if (filters.priority && filters.priority !== "all")
        params.priority = filters.priority;

      const response = await api.get("/tickets", { params });
      setTickets(response.data.data || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      // Fallback logic as requested
      let mocks = [...MOCK_TICKETS];
      if (filters.limit) mocks = mocks.slice(0, filters.limit);
      // Simple client-side filtering for mocks if API fails
      if (filters.search) {
        mocks = mocks.filter(
          (t) =>
            t.subject.toLowerCase().includes(filters.search!.toLowerCase()) ||
            t.description.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
      if (filters.status && filters.status !== "all") {
        mocks = mocks.filter((t) => t.status === filters.status);
      }
      if (filters.priority && filters.priority !== "all") {
        mocks = mocks.filter((t) => t.priority === filters.priority);
      }
      setTickets(mocks);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const updateFilters = (newFilters: Partial<UseTicketsFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    tickets,
    loading,
    refetch: fetchTickets,
    setFilters: updateFilters,
    filters,
  };
};
