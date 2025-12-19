import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/Icon";
import { CreateTicketModal } from "@/components/CreateTicketModal";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";
import { Select } from "@/components/ui/Select";
import api from "../lib/api";
import { useTickets } from "../hooks/useTickets";
import { formatRelativeDate } from "../lib/dateUtils";

export const TicketList: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    tickets,
    loading,
    refetch,
    setFilters,
    filters,
    page,
    setPage,
    totalPages,
  } = useTickets({
    search: "",
    status: "all",
    priority: "all",
  });

  // Parse user role
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "¿Estás seguro de eliminar este ticket? Esta acción no se puede deshacer."
      )
    ) {
      try {
        await api.delete(`/tickets/${id}`);
        toast.success("Ticket eliminado");
        refetch();
      } catch (error) {
        console.error("Error deleting ticket:", error);
        toast.error("Error al eliminar el ticket");
      }
    }
  };

  const handleCreateTicket = async (data: any) => {
    try {
      await api.post("/tickets", data);
      setIsModalOpen(false);
      refetch();
      toast.success("Ticket creado exitosamente");
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Error al crear el ticket");
    }
  };

  const currentTickets = tickets;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "RESOLVED":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "CLOSED":
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
      case "HIGH":
        return "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "LOW":
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="p-8 h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Gestión de Tickets
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {tickets.length} tickets encontrados
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Icon name="add" />
          <span>Nuevo Ticket</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex-1 relative order-1 md:order-none">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar tickets..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>
        <div className="flex gap-2 order-2 md:order-none">
          <Select
            className="w-full md:w-48"
            value={filters.status || "all"}
            onChange={(value) => setFilters({ status: value })}
            options={[
              { value: "all", label: "Estado: Todos" },
              { value: "OPEN", label: "Abiertos", className: "text-blue-600" },
              {
                value: "IN_PROGRESS",
                label: "En Progreso",
                className: "text-yellow-600",
              },
              {
                value: "RESOLVED",
                label: "Resueltos",
                className: "text-green-600",
              },
              {
                value: "CLOSED",
                label: "Cerrados",
                className: "text-gray-600",
              },
            ]}
          />
          <Select
            className="w-full md:w-48"
            value={filters.priority || "all"}
            onChange={(value) => setFilters({ priority: value })}
            options={[
              { value: "all", label: "Prioridad: Todas" },
              {
                value: "LOW",
                label: "Baja",
                icon: "info",
                className: "text-blue-600",
              },
              {
                value: "MEDIUM",
                label: "Media",
                icon: "info",
                className: "text-yellow-600",
              },
              {
                value: "HIGH",
                label: "Alta",
                icon: "warning",
                className: "text-orange-600",
              },
              {
                value: "CRITICAL",
                label: "Crítica",
                icon: "error",
                className: "text-red-600",
              },
            ]}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
        {loading ? (
          <div className="flex-1 p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-full mb-4">
              <Icon
                name="inbox"
                className="text-4xl text-gray-300 dark:text-gray-600"
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No hay tickets
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center mt-1 mb-6">
              No se encontraron tickets con los filtros actuales o aún no has
              creado ninguno.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Icon name="add" />
              <span>Crear nuevo ticket</span>
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-y-auto flex-1 overflow-x-auto min-w-full">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                      Asunto
                    </th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                      Estado
                    </th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                      Prioridad
                    </th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                      Solicitante
                    </th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                      Fecha
                    </th>
                    {loggedInUser?.role === "ADMIN" && (
                      <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700 cursor-pointer transition-colors group"
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                            {ticket.subject}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-xs">
                            {ticket.description}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status === "OPEN"
                            ? "Abierto"
                            : ticket.status === "IN_PROGRESS"
                            ? "En Progreso"
                            : ticket.status === "RESOLVED"
                            ? "Resuelto"
                            : "Cerrado"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${getPriorityColor(
                            ticket.priority
                          )}`}
                        >
                          <Icon
                            name={
                              ticket.priority === "CRITICAL"
                                ? "error"
                                : ticket.priority === "HIGH"
                                ? "warning"
                                : "info"
                            }
                            className="text-[14px]"
                          />
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center"
                            style={{
                              backgroundImage: `url("https://ui-avatars.com/api/?name=${encodeURIComponent(
                                ticket.client?.name || "U"
                              )}&background=random")`,
                            }}
                          ></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {ticket.client?.name || "Usuario"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(ticket.createdAt).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </td>
                      {loggedInUser?.role === "ADMIN" && (
                        <td className="p-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(ticket.id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                            title="Eliminar ticket"
                            aria-label="Eliminar ticket"
                          >
                            <Icon name="delete" className="text-lg" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex-1 overflow-y-auto p-4 space-y-3">
              {currentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm active:scale-[0.98] transition-transform"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
                        {ticket.subject}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                        {ticket.description}
                      </p>
                    </div>
                    {loggedInUser?.role === "ADMIN" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(ticket.id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <Icon name="delete" className="text-lg" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status === "OPEN"
                          ? "Abierto"
                          : ticket.status === "IN_PROGRESS"
                          ? "En Progreso"
                          : ticket.status === "RESOLVED"
                          ? "Resuelto"
                          : "Cerrado"}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(ticket.createdAt).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "2-digit",
                          }
                        )}
                      </span>
                    </div>

                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        ticket.priority === "CRITICAL"
                          ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                          : ticket.priority === "HIGH"
                          ? "bg-orange-500"
                          : ticket.priority === "MEDIUM"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                      title={`Prioridad: ${ticket.priority}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Floating Action Button (FAB) for creating tickets could go here if header button wasn't enough */}
          </>
        )}

        {/* Pagination Controls */}
        {!loading && tickets.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTicket}
      />
    </div>
  );
};
