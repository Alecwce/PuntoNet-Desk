import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "../components/Icon";
import { CreateTicketModal } from "../components/CreateTicketModal";
import { ExportTicketsModal } from "../components/ExportTicketsModal";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { Ticket, PaginatedResponse } from "../types";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

interface TicketListProps {
  onNavigate?: any; // Deprecated but kept for compatibility
}

export const TicketList: React.FC<TicketListProps> = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    status: "ALL",
    priority: "ALL",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeMenuTicketId, setActiveMenuTicketId] = useState<string | null>(
    null
  );
  const [ticketToEdit, setTicketToEdit] = useState<Ticket | null>(null);
  const [ticketToDeleteId, setTicketToDeleteId] = useState<string | null>(null);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 10,
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (filters.status !== "ALL") params.status = filters.status;
      if (filters.priority !== "ALL") params.priority = filters.priority;

      const response = await api.get<PaginatedResponse<Ticket>>("/tickets", {
        params,
      });
      setTickets(response.data.data || []);
      setTotalPages(response.data.meta?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters.status, filters.priority]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Handlers for creating/updating
  const handleCreateTicket = async (data: any) => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const creatorId = user?.id;

      if (!creatorId) {
        console.error("No user found in localStorage");
        return;
      }

      await api.post("/tickets", { ...data, creatorId });
      setIsModalOpen(false);
      fetchTickets();
    } catch (error) {
      console.error("Error creating", error);
    }
  };

  const handleEditTicket = async (id: string, data: any) => {
    try {
      await api.put(`/tickets/${id}`, data);
      setIsModalOpen(false);
      fetchTickets();
    } catch (error) {
      console.error("Error updating", error);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    try {
      await api.delete(`/tickets/${id}`);
      setTicketToDeleteId(null);
      setIsDeleteModalOpen(false);
      fetchTickets();
    } catch (error) {
      console.error("Error deleting", error);
    }
  };

  const handleEditClick = (e: React.MouseEvent, ticket: Ticket) => {
    e.stopPropagation();
    setTicketToEdit(ticket);
    setIsModalOpen(true);
    setActiveMenuTicketId(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setTicketToDeleteId(id);
    setIsDeleteModalOpen(true);
    setActiveMenuTicketId(null);
  };

  // Close menu logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeMenuTicketId &&
        !(event.target as Element).closest(".action-menu-trigger") &&
        !(event.target as Element).closest(".action-menu-content")
      ) {
        setActiveMenuTicketId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenuTicketId]);

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <label className="flex flex-col min-w-40 !h-10 max-w-sm w-full">
            <div className="flex w-full flex-1 items-stretch rounded-DEFAULT h-full shadow-sm">
              <div className="text-gray-500 flex border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 items-center justify-center pl-3 rounded-l-DEFAULT border-r-0">
                <Icon name="search" />
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-DEFAULT text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                placeholder="Buscar por ID, asunto, cliente..."
                value={filters.search}
                onChange={(e) => {
                  setFilters({ ...filters, search: e.target.value });
                  setPage(1);
                }}
              />
            </div>
          </label>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-DEFAULT bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors text-gray-700 dark:text-gray-200"
          >
            <Icon
              name="ios_share"
              className="text-gray-600 dark:text-gray-300"
            />
            <p className="text-sm font-medium leading-normal">Exportar</p>
          </button>
          <button
            onClick={() => {
              setTicketToEdit(null);
              setIsModalOpen(true);
            }}
            className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-DEFAULT bg-primary px-4 text-white hover:bg-primary/90 shadow-sm transition-colors"
          >
            <Icon name="add" />
            <p className="text-sm font-medium leading-normal">Nuevo Ticket</p>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium whitespace-nowrap">
            Filtros:
          </p>

          {/* Status Filter */}
          <div className="relative">
            <select
              className="appearance-none h-8 pl-3 pr-8 rounded-DEFAULT bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium focus:ring-primary/50 cursor-pointer"
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                setPage(1);
              }}
            >
              <option value="ALL">Todos los estados</option>
              <option value="OPEN">Abierto</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="RESOLVED">Resuelto</option>
              <option value="CLOSED">Cerrado</option>
            </select>
            <Icon
              name="expand_more"
              className="text-sm text-gray-500 absolute right-2 top-2 pointer-events-none"
            />
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              className="appearance-none h-8 pl-3 pr-8 rounded-DEFAULT bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium focus:ring-primary/50 cursor-pointer"
              value={filters.priority}
              onChange={(e) => {
                setFilters({ ...filters, priority: e.target.value });
                setPage(1);
              }}
            >
              <option value="ALL">Todas las prioridades</option>
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
              <option value="CRITICAL">Crítica</option>
            </select>
            <Icon
              name="expand_more"
              className="text-sm text-gray-500 absolute right-2 top-2 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <p>Cargando tickets...</p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm relative">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left w-12">
                    <input
                      className="h-4 w-4 rounded border-gray-300 bg-transparent text-primary focus:ring-primary/50"
                      type="checkbox"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">
                    ID Ticket
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">
                    Asunto
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">
                    Creador
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">
                    Asignado a
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {(tickets || []).map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 w-12">
                      <input
                        className="h-4 w-4 rounded border-gray-300 bg-transparent text-primary focus:ring-primary/50"
                        type="checkbox"
                      />
                    </td>
                    <td
                      className="px-4 py-3 text-primary text-sm font-medium cursor-pointer hover:underline"
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                    >
                      TK-{ticket.id.substring(0, 6).toUpperCase()}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-800 dark:text-gray-100 text-sm font-bold cursor-pointer"
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                    >
                      {ticket.subject}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-sm">
                      {(ticket as any).creator?.name || "Desconocido"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${
                              ticket.priority === "HIGH" ||
                              ticket.priority === "CRITICAL"
                                ? "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200"
                                : ticket.priority === "MEDIUM"
                                ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200"
                                : "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                            }`}
                      >
                        {ticket.priority === "LOW"
                          ? "Baja"
                          : ticket.priority === "MEDIUM"
                          ? "Media"
                          : ticket.priority === "HIGH"
                          ? "Alta"
                          : "Crítica"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                        {ticket.status === "OPEN"
                          ? "Abierto"
                          : ticket.status === "IN_PROGRESS"
                          ? "En Progreso"
                          : ticket.status === "RESOLVED"
                          ? "Resuelto"
                          : "Cerrado"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {ticket.assignee ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-6 border border-gray-200"
                            style={{
                              backgroundImage: `url("${ticket.assignee.avatar}")`,
                            }}
                          ></div>
                          <span className="text-sm text-gray-700 dark:text-gray-200">
                            {ticket.assignee.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Sin asignar
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 relative">
                      {(() => {
                        const userStr = localStorage.getItem("user");
                        const user = userStr ? JSON.parse(userStr) : null;
                        const isAdminOrAgent =
                          user?.role === "ADMIN" || user?.role === "AGENT";

                        if (!isAdminOrAgent) return null;

                        return (
                          <>
                            <button
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-white action-menu-trigger p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuTicketId(
                                  activeMenuTicketId === ticket.id
                                    ? null
                                    : ticket.id
                                );
                              }}
                            >
                              <Icon name="more_vert" />
                            </button>
                            {activeMenuTicketId === ticket.id && (
                              <div className="action-menu-content absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                <div className="py-1">
                                  <button
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 gap-2"
                                    onClick={(e) => handleEditClick(e, ticket)}
                                  >
                                    <Icon
                                      name="edit"
                                      className="text-gray-500 text-base"
                                    />{" "}
                                    Editar
                                  </button>
                                  {user?.role === "ADMIN" && (
                                    <button
                                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 gap-2"
                                      onClick={(e) =>
                                        handleDeleteClick(e, ticket.id)
                                      }
                                    >
                                      <Icon
                                        name="delete"
                                        className="text-base"
                                      />{" "}
                                      Eliminar
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTicket}
        onEdit={handleEditTicket}
        ticketToEdit={ticketToEdit}
      />

      <ExportTicketsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        tickets={tickets}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() =>
          ticketToDeleteId && handleDeleteTicket(ticketToDeleteId)
        }
      />
    </div>
  );
};
