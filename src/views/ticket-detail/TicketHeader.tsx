import React from "react";
import { Icon } from "../../components/Icon";
import { Ticket } from "../../types";

interface TicketHeaderProps {
  ticket: Ticket;
  onBack: () => void;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
}

export const TicketHeader: React.FC<TicketHeaderProps> = ({
  ticket,
  onBack,
  onStatusChange,
  onPriorityChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400"
        >
          <Icon name="arrow_back" />
        </button>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              #{ticket.id.substring(0, 8)}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                ${
                  ticket.status === "OPEN"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                    : ticket.status === "IN_PROGRESS"
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                }`}
            >
              {ticket.status === "OPEN"
                ? "Abierto"
                : ticket.status === "IN_PROGRESS"
                ? "En Progreso"
                : ticket.status === "RESOLVED"
                ? "Resuelto"
                : ticket.status === "CLOSED"
                ? "Cerrado"
                : ticket.status}
            </span>
          </div>
          <h2 className="text-sm text-gray-600 dark:text-gray-300">
            {ticket.subject}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Status Selector */}
        <select
          className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
          value={ticket.status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="OPEN">Abierto</option>
          <option value="IN_PROGRESS">En Progreso</option>
          <option value="RESOLVED">Resuelto</option>
          <option value="CLOSED">Cerrado</option>
        </select>

        {/* Priority Selector */}
        <select
          className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
          value={ticket.priority}
          onChange={(e) => onPriorityChange(e.target.value)}
        >
          <option value="LOW">Baja</option>
          <option value="MEDIUM">Media</option>
          <option value="HIGH">Alta</option>
          <option value="CRITICAL">Crítica</option>
        </select>
      </div>
    </div>
  );
};
