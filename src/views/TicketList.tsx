import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "../components/Icon";
import { CreateTicketModal } from "../components/CreateTicketModal";
import { ExportTicketsModal } from "../components/ExportTicketsModal";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { Ticket, PaginatedResponse } from "../types";
import api from "../lib/api";

interface TicketListProps {
  onTicketSelect: (id: string) => void;
}

export const TicketList: React.FC<TicketListProps> = ({ onTicketSelect }) => {
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
      const params: Record<string, unknown> = { page, limit: 10 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (filters.status !== "ALL") params.status = filters.status;
      if (filters.priority !== "ALL") params.priority = filters.priority;

      const response = await api.get<PaginatedResponse<Ticket>>("/tickets", {
        params,
      });
      setTickets(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters.status, filters.priority]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Handlers
  const handleCreateTicket = async (data: Record<string, unknown>) => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user?.id) return;
      await api.post("/tickets", { ...data, creatorId: user.id });
      setIsModalOpen(false);
      fetchTickets();
    } catch (error) {
      console.error("Error creating", error);
    }
  };

  const handleEditTicket = async (
    id: string,
    data: Record<string, unknown>
  ) => {
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

  // Close menu on outside click
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

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdminOrAgent = user?.role === "ADMIN" || user?.role === "AGENT";

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 animate-fade-in">
      {/* Header with Search and Actions */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 w-full lg:max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon name="search" className="text-gray-400" />
            </div>
            <input
              className="w-full pl-11 pr-4 py-3 rounded-xl transition-all duration-200
                         bg-white/80 dark:bg-white/5 backdrop-blur-md
                         border border-gray-200/50 dark:border-white/10
                         focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                         text-gray-900 dark:text-white placeholder:text-gray-400
                         text-sm"
              placeholder="Buscar por ID, asunto, cliente..."
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200
                       bg-white/80 dark:bg-white/5 backdrop-blur-md
                       border border-gray-200/50 dark:border-white/10
                       hover:border-gray-300 dark:hover:border-white/20
                       text-gray-700 dark:text-gray-200 text-sm font-medium"
          >
            <Icon name="ios_share" className="text-lg" />
            Exportar
          </button>
          <button
            onClick={() => {
              setTicketToEdit(null);
              setIsModalOpen(true);
            }}
            className="glass-button flex items-center gap-2"
          >
            <Icon name="add" className="text-lg" />
            Nuevo Ticket
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div
        className="flex flex-wrap items-center gap-3 p-4 rounded-xl backdrop-blur-md
                      bg-white/80 dark:bg-white/5
                      border border-gray-200/50 dark:border-white/10"
      >
        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center gap-2">
          <Icon name="filter_alt" className="text-lg" />
          Filtros:
        </span>

        {/* Status Filter */}
        <select
          className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all
                     bg-gray-100 dark:bg-white/10
                     border-0 text-gray-700 dark:text-gray-300
                     focus:ring-2 focus:ring-blue-500/30"
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

        {/* Priority Filter */}
        <select
          className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all
                     bg-gray-100 dark:bg-white/10
                     border-0 text-gray-700 dark:text-gray-300
                     focus:ring-2 focus:ring-blue-500/30"
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

        {(filters.status !== "ALL" || filters.priority !== "ALL") && (
          <button
            onClick={() =>
              setFilters({
                search: filters.search,
                status: "ALL",
                priority: "ALL",
              })
            }
            className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            <Icon name="close" className="text-sm" />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Table Container */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Cargando tickets...
          </p>
        </div>
      ) : (
        <div
          className="rounded-2xl backdrop-blur-md overflow-hidden
                        bg-white/80 dark:bg-white/5
                        border border-gray-200/50 dark:border-white/10"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-white/5">
                  {[
                    "ID",
                    "Asunto",
                    "Creador",
                    "Prioridad",
                    "Estado",
                    "Asignado",
                    "",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <Icon
                        name="inbox"
                        className="text-5xl text-gray-300 dark:text-gray-600 mb-3"
                      />
                      <p className="text-gray-500 dark:text-gray-400">
                        No se encontraron tickets
                      </p>
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="hover:bg-blue-50/50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                      onClick={() => onTicketSelect(ticket.id)}
                    >
                      <td className="px-6 py-4 text-sm font-mono text-blue-600 dark:text-blue-400">
                        TK-{ticket.id.substring(0, 6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {(
                          ticket as Record<string, unknown> & {
                            creator?: { name: string };
                          }
                        ).creator?.name || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                          ${
                            ticket.priority === "CRITICAL"
                              ? "bg-red-500/20 text-red-600 dark:text-red-400"
                              : ""
                          }
                          ${
                            ticket.priority === "HIGH"
                              ? "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                              : ""
                          }
                          ${
                            ticket.priority === "MEDIUM"
                              ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                              : ""
                          }
                          ${
                            ticket.priority === "LOW"
                              ? "bg-green-500/20 text-green-600 dark:text-green-400"
                              : ""
                          }
                        `}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full
                            ${
                              ticket.priority === "CRITICAL" ? "bg-red-500" : ""
                            }
                            ${ticket.priority === "HIGH" ? "bg-orange-500" : ""}
                            ${
                              ticket.priority === "MEDIUM"
                                ? "bg-yellow-500"
                                : ""
                            }
                            ${ticket.priority === "LOW" ? "bg-green-500" : ""}
                          `}
                          />
                          {ticket.priority === "LOW" && "Baja"}
                          {ticket.priority === "MEDIUM" && "Media"}
                          {ticket.priority === "HIGH" && "Alta"}
                          {ticket.priority === "CRITICAL" && "Crítica"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                          ${
                            ticket.status === "OPEN"
                              ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                              : ""
                          }
                          ${
                            ticket.status === "IN_PROGRESS"
                              ? "bg-purple-500/20 text-purple-600 dark:text-purple-400"
                              : ""
                          }
                          ${
                            ticket.status === "RESOLVED"
                              ? "bg-green-500/20 text-green-600 dark:text-green-400"
                              : ""
                          }
                          ${
                            ticket.status === "CLOSED"
                              ? "bg-gray-500/20 text-gray-600 dark:text-gray-400"
                              : ""
                          }
                        `}
                        >
                          {ticket.status === "OPEN" && "Abierto"}
                          {ticket.status === "IN_PROGRESS" && "En Progreso"}
                          {ticket.status === "RESOLVED" && "Resuelto"}
                          {ticket.status === "CLOSED" && "Cerrado"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {ticket.assignee ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 bg-cover
                                         border-2 border-white dark:border-slate-800"
                              style={{
                                backgroundImage: ticket.assignee.avatar
                                  ? `url("${ticket.assignee.avatar}")`
                                  : undefined,
                              }}
                            >
                              {!ticket.assignee.avatar && (
                                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                                  {ticket.assignee.name?.charAt(0) || "?"}
                                </div>
                              )}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {ticket.assignee.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Sin asignar
                          </span>
                        )}
                      </td>
                      <td
                        className="px-6 py-4 relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {isAdminOrAgent && (
                          <>
                            <button
                              className="action-menu-trigger p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white
                                         hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
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
                              <div
                                className="action-menu-content absolute right-4 top-12 w-40 rounded-xl overflow-hidden
                                              bg-white dark:bg-slate-800 shadow-xl
                                              border border-gray-200 dark:border-white/10 z-50 animate-scale-in"
                              >
                                <button
                                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200
                                             hover:bg-gray-50 dark:hover:bg-white/5 gap-2 transition-colors"
                                  onClick={(e) => handleEditClick(e, ticket)}
                                >
                                  <Icon name="edit" className="text-gray-400" />
                                  Editar
                                </button>
                                {user?.role === "ADMIN" && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400
                                               hover:bg-red-50 dark:hover:bg-red-500/10 gap-2 transition-colors"
                                    onClick={(e) =>
                                      handleDeleteClick(e, ticket.id)
                                    }
                                  >
                                    <Icon name="delete" />
                                    Eliminar
                                  </button>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-200/50 dark:border-white/10 flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all
                           bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300
                           hover:bg-gray-200 dark:hover:bg-white/20
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all
                           bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300
                           hover:bg-gray-200 dark:hover:bg-white/20
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
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
