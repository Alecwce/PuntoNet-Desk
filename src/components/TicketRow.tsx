import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { Ticket } from "../types";
import { calculateSLA } from "../lib/slaUtils";
import { analyzeSentiment } from "../lib/sentiment";

interface TicketRowProps {
  ticket: Ticket;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

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

export const TicketRow = React.memo(({ ticket, isAdmin, onDelete }: TicketRowProps) => {
  const navigate = useNavigate();

  return (
    <tr
      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700 cursor-pointer transition-colors group"
      onClick={(e) => {
        // Only navigate if the click wasn't on a button or interactive element
        // And make sure we don't navigate if defaultPrevented (from delete button)
        const target = e.target as HTMLElement;
        if (!e.defaultPrevented && !target.closest('button') && !target.closest('[role="button"]')) {
          navigate(`/tickets/${ticket.id}`);
        }
      }}
    >
      <td className="p-4">
        <div>
          <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors flex items-center gap-2">
            {ticket.subject}
            <span
              title={`Sentimiento: ${
                analyzeSentiment(ticket.description || ticket.subject).label
              }`}
              className="text-xs"
            >
              {analyzeSentiment(ticket.description || ticket.subject).emoji}
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
              className={`text-[10px] px-1.5 py-0.5 rounded w-fit text-white ${
                calculateSLA(ticket).color
              }`}
              title={calculateSLA(ticket).label}
            >
              {calculateSLA(ticket).label.split("(")[0]}
            </span>
          )}
        </div>
      </td>
      {isAdmin && (
        <td className="p-4 text-right">
          <button
            onClick={(e) => {
              e.preventDefault();
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
});
