import React from "react";
import { Icon } from "../../../components/Icon";

export const KbTab: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <div className="relative">
        <Icon name="search" className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar soluciones en la base de conocimiento..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="lightbulb" className="text-yellow-500" />
          Artículos Sugeridos
        </h4>
        <div className="space-y-3">
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
            <h5 className="text-primary font-medium text-sm group-hover:underline">
              Solución de problemas de VPN
            </h5>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              Guía completa para diagnosticar y resolver errores comunes al
              conectar con la VPN corporativa (Error 619, 800, etc).
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] text-gray-600 dark:text-gray-400">
                Redes
              </span>
              <span className="text-[10px] text-gray-400">
                • Actualizado hace 2 días
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
            <h5 className="text-primary font-medium text-sm group-hover:underline">
              Restablecimiento de Contraseñas del Portal
            </h5>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              Pasos para restablecer contraseñas de usuarios bloqueados en el
              portal de servicios.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] text-gray-600 dark:text-gray-400">
                Acceso
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
