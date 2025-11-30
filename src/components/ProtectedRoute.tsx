import React from "react";
import { CURRENT_USER } from "../constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  if (!allowedRoles.includes(CURRENT_USER.role)) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl mb-4 text-red-500">
            lock
          </span>
          <h2 className="text-2xl font-semibold mb-2">Acceso Restringido</h2>
          <p>No tienes permisos para ver esta página.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
