import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/Icon";
import { Ticket } from "@/types";
import { analyzeSentiment } from "@/lib/sentiment";
import { calculateSLA } from "@/lib/slaUtils";
import { getStatusColor, getPriorityColor } from "@/lib/ticketUtils";

interface TicketRowProps {
  ticket: Ticket;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

export const TicketRow: React.FC<TicketRowProps> = React.memo(
  ({ ticket, isAdmin, onDelete }) => {
    const navigate = useNavigate();

    const sentiment = analyzeSentiment(ticket.description || ticket.subject);
    const sla = calculateSLA(ticket);

    return (
      <tr
        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700 cursor-pointer transition-colors group"
        onClick={() => navigate(`/tickets/${ticket.id}`)}
      >
        <td className="p-4">
          <div>
            <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors flex items-center gap-2">
              {ticket.subject}
              <span
                title={`Sentimiento: ${sentiment.label}`}
                className="text-xs"
              >
                {sentiment.emoji}
              </span>
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
          <div className="flex flex-col gap-1">
            <span>
              {new Date(ticket.createdAt).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
            {ticket.status !== "CLOSED" && ticket.status !== "RESOLVED" && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded w-fit text-white ${sla.color}`}
                title={sla.label}
              >
                {sla.label.split("(")[0]}
              </span>
            )}
          </div>
        </td>
        {isAdmin && (
          <td className="p-4 text-right">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(ticket.id);
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
    );
  }
);
