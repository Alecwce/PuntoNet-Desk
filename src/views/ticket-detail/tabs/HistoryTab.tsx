import React from "react";
import { Icon } from "../../../components/Icon";

export const HistoryTab: React.FC = () => {
  return (
    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
      <Icon
        name="history"
        className="text-5xl mb-4 mx-auto opacity-30 text-gray-400 dark:text-gray-600"
      />
      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
        Historial de Cambios
      </h4>
      <p className="text-sm max-w-sm mx-auto">
        Próximamente podrás ver aquí un registro detallado de todos los cambios
        de estado, asignaciones y notas internas del ticket.
      </p>
    </div>
  );
};
