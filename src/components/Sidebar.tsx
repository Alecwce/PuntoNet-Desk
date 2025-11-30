import React from "react";
import { CURRENT_USER } from "../constants";
import { ViewState } from "../types";
import { Icon } from "./Icon";

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onLogout,
}) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "dashboard",
      roles: ["ADMIN", "AGENT", "CLIENT"],
    },
    {
      id: "tickets",
      label: "Gestión de Tickets",
      icon: "confirmation_number",
      roles: ["ADMIN", "AGENT", "CLIENT"],
    },
    {
      id: "kb",
      label: "Base de Conocimiento",
      icon: "menu_book",
      roles: ["ADMIN", "AGENT", "CLIENT"],
    },
    {
      id: "clients",
      label: "Clientes",
      icon: "group",
      roles: ["ADMIN", "AGENT"],
    },
    { id: "reports", label: "Reportes", icon: "bar_chart", roles: ["ADMIN"] },
    {
      id: "settings",
      label: "Configuración",
      icon: "settings",
      roles: ["ADMIN", "AGENT", "CLIENT"],
    },
  ];

  return (
    <aside className="hidden md:flex h-full w-64 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 shrink-0">
      <div className="flex flex-col justify-between p-4 h-full">
        <div className="flex flex-col gap-4">
          <div
            className="flex items-center gap-3 px-3 py-2 cursor-pointer"
            onClick={() => onNavigate("dashboard")}
          >
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-primary flex items-center justify-center shadow-md">
              <Icon name="support_agent" className="text-white" />
            </div>
            <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-normal">
              PuntoNet Desk
            </h1>
          </div>

          <nav className="flex flex-col gap-2 mt-4">
            {menuItems
              .filter((item) => item.roles.includes(CURRENT_USER.role))
              .map((item) => {
                // Simple logic to highlight parent views
                const isActive =
                  currentView === item.id ||
                  (item.id === "tickets" && currentView === "ticket-detail");
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id as ViewState)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-DEFAULT transition-colors ${
                      isActive
                        ? "bg-primary/10 dark:bg-primary/20 text-primary dark:text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    <Icon name={item.icon} fill={isActive} />
                    <p className="text-sm font-medium leading-normal">
                      {item.label}
                    </p>
                  </button>
                );
              })}
          </nav>
        </div>

        <div className="flex flex-col gap-1 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-3 px-3 py-2 rounded-DEFAULT hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border border-gray-200 dark:border-gray-700"
              style={{ backgroundImage: `url("${CURRENT_USER.avatar}")` }}
            ></div>
            <div className="flex flex-col text-left">
              <p className="text-gray-900 dark:text-white text-sm font-semibold leading-normal">
                {CURRENT_USER.name}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                {CURRENT_USER.role}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-DEFAULT hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <Icon name="logout" />
            <p className="text-sm font-medium leading-normal">Logout</p>
          </button>
        </div>
      </div>
    </aside>
  );
};
