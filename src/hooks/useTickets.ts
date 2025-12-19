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
      setTickets([]);
      // You might want to set an error state here to show a UI message
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
