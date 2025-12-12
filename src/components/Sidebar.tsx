import React from "react";
import { Icon } from "./Icon";
import { ViewState } from "../types";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  currentView: ViewState;
  onNavigate: any; // Deprecated, kept for interface compat during migration
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onLogout }) => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems: {
    id: ViewState;
    icon: string;
    label: string;
    path: string;
    roles?: string[];
  }[] = [
    {
      id: "dashboard",
      icon: "dashboard",
      label: "Dashboard",
      path: "/dashboard",
      roles: ["ADMIN", "AGENT", "CLIENT"],
    },
    {
      id: "tickets",
      icon: "confirmation_number",
      label: "Tickets",
      path: "/tickets",
      roles: ["ADMIN", "AGENT", "CLIENT"],
    },
    {
      id: "kb",
      icon: "library_books",
      label: "Base de Conoc.",
      path: "/kb",
      roles: ["ADMIN", "AGENT", "CLIENT"],
    },
    {
      id: "clients",
      icon: "people",
      label: "Clientes",
      path: "/clients",
      roles: ["ADMIN"],
    },
    {
      id: "reports",
      icon: "bar_chart",
      label: "Reportes",
      path: "/reports",
      roles: ["ADMIN"],
    },
    {
      id: "settings",
      icon: "settings",
      label: "Configuración",
      path: "/settings",
      roles: ["ADMIN"],
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-card-dark border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0 transition-colors duration-200">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Icon name="dns" className="text-primary text-xl" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            PuntoNet Desk
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {menuItems
          .filter(
            (item) => user && (!item.roles || item.roles.includes(user.role))
          )
          .map((item) => {
            const isActive =
              currentView === item.id ||
              (item.id === "tickets" && currentView === "ticket-detail") ||
              location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative
                  ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }
                `}
              >
                <Icon
                  name={item.icon}
                  className={`text-xl transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-primary dark:text-gray-500 dark:group-hover:text-gray-300"
                  }`}
                />
                {item.label}
                {isActive && (
                  <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white/50" />
                )}
              </Link>
            );
          })}
      </nav>

      {/* User & Logout */}
      <div className="flex flex-col gap-1 border-t border-gray-200 dark:border-gray-800 pt-4 p-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer mb-2">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border border-gray-200 dark:border-gray-700"
            style={{
              backgroundImage: `url("${
                user?.avatar ||
                "https://ui-avatars.com/api/?name=" + (user?.name || "User")
              }")`,
            }}
          ></div>
          <div className="flex flex-col text-left overflow-hidden">
            <p className="text-gray-900 dark:text-white text-sm font-semibold leading-normal truncate w-full">
              {user?.name || "Usuario"}
            </p>
            <p className="text-gray-500 text-xs font-normal leading-normal truncate w-full">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Icon name="logout" className="text-xl" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};
