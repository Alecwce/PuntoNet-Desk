import React from "react";
import { KPI_DATA } from "../constants";
import { Icon } from "../components/Icon";
import { Ticket } from "../types";

interface DashboardProps {
  tickets: Ticket[];
  onTicketSelect: (ticketId: string) => void;
  onViewAll: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  tickets,
  onTicketSelect,
  onViewAll,
}) => {
  const recentTickets = tickets.slice(0, 4);
  // Find the specific preview ticket or default to the first one available
  const previewTicketId = "TK-12345";
  const previewTicket =
    tickets.find((t) => t.id === previewTicketId) ||
    (tickets.length > 0 ? tickets[0] : null);

  return (
    <div className="p-8 space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {KPI_DATA.map((kpi, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 rounded-lg p-5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm transition-transform hover:-translate-y-1 duration-200"
          >
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium leading-normal">
              {kpi.label}
            </p>
            <p className="text-gray-900 dark:text-white tracking-tight text-3xl font-bold leading-tight">
              {kpi.value}
            </p>
            <div
              className={`flex items-center text-sm font-medium leading-normal ${
                kpi.trendColor === "green"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              <Icon
                name={
                  kpi.trendDirection === "up" ? "trending_up" : "trending_down"
                }
                className="text-base"
              />
              <p>{kpi.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Table Section */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Gestión de Tickets Recientes
            </h2>
            <div className="flex gap-2">
              <button
                onClick={onViewAll}
                className="text-primary text-sm font-medium hover:underline"
              >
                Ver todos
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left w-12">
                      <input
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-transparent text-primary focus:ring-primary/50"
                        type="checkbox"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">
                      Asunto
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {recentTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                      onClick={() => onTicketSelect(ticket.id)}
                    >
                      <td className="px-4 py-3 w-12">
                        <input
                          className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-transparent text-primary focus:ring-primary/50"
                          type="checkbox"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm font-normal">
                        {ticket.id}
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-100 text-sm font-semibold">
                        {ticket.subject}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                ${
                                  ticket.priority === "Alta" ||
                                  ticket.priority === "Crítica"
                                    ? "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200"
                                    : ticket.priority === "Media"
                                    ? "bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200"
                                    : "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                                }`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                        {ticket.status}
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 border border-gray-200"
                          style={{
                            backgroundImage: `url("${ticket.assignee.avatar}")`,
                          }}
                        ></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Drawer Panel (Preview) */}
        {previewTicket && (
          <div className="col-span-12 lg:col-span-4 flex flex-col h-[600px] bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden sticky top-4">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/30">
              <div>
                <p className="text-xs text-gray-500">{previewTicket.id}</p>
                <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
                  {previewTicket.subject}
                </h3>
              </div>
              <button
                onClick={() => onTicketSelect(previewTicket.id)}
                className="flex items-center justify-center gap-2 h-8 px-3 bg-primary text-white text-xs font-medium rounded-DEFAULT hover:bg-primary/90"
              >
                <Icon name="open_in_new" className="text-sm" />
                Abrir
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/20">
              {previewTicket.messages && previewTicket.messages.length > 0 ? (
                previewTicket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      msg.isMe ? "justify-end" : ""
                    }`}
                  >
                    {!msg.isMe && (
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 shrink-0"
                        style={{ backgroundImage: `url("${msg.avatar}")` }}
                      ></div>
                    )}
                    <div
                      className={`flex flex-col gap-1 ${
                        msg.isMe ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg text-sm max-w-[240px] shadow-sm ${
                          msg.isMe
                            ? "rounded-tr-none bg-primary/10 dark:bg-primary/30 text-gray-800 dark:text-gray-200 border border-primary/20"
                            : "rounded-tl-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {msg.sender.split(" ")[0]} · {msg.timestamp}
                      </span>
                    </div>
                    {msg.isMe && (
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 shrink-0"
                        style={{ backgroundImage: `url("${msg.avatar}")` }}
                      ></div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 text-sm mt-10">
                  No hay mensajes recientes
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50">
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Artículos relacionados
              </h4>
              <div className="flex flex-col gap-2">
                <div className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-sm cursor-pointer transition-shadow">
                  <p className="text-xs font-semibold text-primary truncate">
                    Solución a problemas comunes de VPN
                  </p>
                </div>
                <div className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-sm cursor-pointer transition-shadow">
                  <p className="text-xs font-semibold text-primary truncate">
                    Resetear token de seguridad
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
