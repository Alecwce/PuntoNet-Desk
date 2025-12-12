import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { Ticket } from "../../types";
import { TicketHeader } from "./TicketHeader";
import { TicketTabs } from "./TicketTabs";
import { DetailsTab } from "./tabs/DetailsTab";
import { ActivityTab } from "./tabs/ActivityTab";
import { AttachmentsTab } from "./tabs/AttachmentsTab";
import { KbTab } from "./tabs/KbTab";
import { HistoryTab } from "./tabs/HistoryTab";

export const TicketDetailContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("activity");

  const fetchTicket = async () => {
    if (!id) return;
    try {
      const response = await api.get(`/tickets/${id}`);
      setTicket(response.data);
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket) return;
    try {
      await api.put(`/tickets/${ticket.id}`, { status: newStatus });
      setTicket({ ...ticket, status: newStatus as any });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!ticket) return;
    try {
      await api.put(`/tickets/${ticket.id}`, { priority: newPriority });
      setTicket({ ...ticket, priority: newPriority as any });
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  if (loading)
    return (
      <div className="p-8 flex justify-center text-gray-500">
        Cargando detalles...
      </div>
    );

  if (!ticket)
    return (
      <div className="p-8 flex justify-center text-red-500">
        Ticket no encontrado
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-background-dark">
      <TicketHeader
        ticket={ticket}
        onBack={() => navigate(-1)}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 mx-4 my-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
          <TicketTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "details" && <DetailsTab ticket={ticket} />}
            {activeTab === "activity" && (
              <ActivityTab ticket={ticket} refreshTicket={fetchTicket} />
            )}
            {activeTab === "attachments" && (
              <AttachmentsTab ticket={ticket} refreshTicket={fetchTicket} />
            )}
            {activeTab === "kb" && <KbTab />}
            {activeTab === "history" && <HistoryTab />}
          </div>
        </div>

        {/* Sidebar Info - Extract this too if larger refactor needed, but keeping simple for now */}
        <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-6 overflow-y-auto hidden xl:block">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
            Información del Ticket
          </h3>
          <div className="space-y-6">
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">
                Asignado a
              </span>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">
                  {(ticket.assignee as any)?.name?.charAt(0) || "?"}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {(ticket.assignee as any)?.name || "Sin asignar"}
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">
                Creado
              </span>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {new Date((ticket as any).createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">
                Última actualización
              </span>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {new Date((ticket as any).updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
