import React, { useState, useEffect } from "react";
import { Icon } from "@/components/Icon";
import { CreateTicketModal } from "@/components/CreateTicketModal";
import api from "../lib/api";
import { Ticket } from "../types";

interface TicketListProps {
  onTicketSelect: (id: string) => void;
}

export const TicketList: React.FC<TicketListProps> = ({ onTicketSelect }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, [search, statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;
      if (priorityFilter !== "all") params.priority = priorityFilter;

      const response = await api.get("/tickets", { params });
      setTickets(response.data.data || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (data: any) => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user?.id) {
        console.error("User not logged in");
        return;
      }

      await api.post("/tickets", { ...data, creatorId: user.id });
      setIsModalOpen(false);
      fetchTickets();
    } catch (error) {
      console.error("Error creating ticket:", error);
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
        <div className="flex-1 relative">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar tickets..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos los estados</option>
          <option value="OPEN">Abiertos</option>
          <option value="IN_PROGRESS">En Progreso</option>
          <option value="RESOLVED">Resueltos</option>
          <option value="CLOSED">Cerrados</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">Todas las prioridades</option>
          <option value="LOW">Baja</option>
          <option value="MEDIUM">Media</option>
          <option value="HIGH">Alta</option>
          <option value="CRITICAL">Crítica</option>
        </select>
      </div>

      {/* List */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500">Cargando tickets...</p>
            </div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Icon name="inbox" className="text-6xl mb-4" />
            <p className="text-lg">No se encontraron tickets</p>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left border-collapse">
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => onTicketSelect(ticket.id)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group"
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
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
