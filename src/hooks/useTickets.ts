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

  // Debounced search state to prevent API spam while typing
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  // Sync debounced search with actual search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500); // Wait 500ms after last keystroke

    return () => clearTimeout(timer);
  }, [filters.search]);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page };
      // Just add params if they have value and are not "all"
      if (filters.limit) params.limit = filters.limit;

      // Use debouncedSearch for the API call instead of raw filters.search
      if (debouncedSearch) params.search = debouncedSearch;

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
  }, [debouncedSearch, filters.status, filters.priority, filters.limit, page]);

  // Trigger fetch when fetchTickets dependency changes
  // This now happens immediately for Page/Status/Priority changes,
  // but is delayed (debounced) for Search changes.
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

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
