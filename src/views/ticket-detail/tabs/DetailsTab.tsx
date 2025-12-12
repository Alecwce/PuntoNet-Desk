import React from "react";
import { Ticket } from "../../../types";

interface DetailsTabProps {
  ticket: Ticket;
}

export const DetailsTab: React.FC<DetailsTabProps> = ({ ticket }) => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Descripción
      </h3>
      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
        {(ticket as any).description || "Sin descripción"}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Cliente
          </span>
          <p className="mt-1 text-sm text-gray-900 dark:text-white">
            {(ticket as any).creator?.name || "Desconocido"}
          </p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Email
          </span>
          <p className="mt-1 text-sm text-gray-900 dark:text-white">
            {(ticket as any).creator?.email || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};
