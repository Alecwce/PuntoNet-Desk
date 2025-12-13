import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ViewState } from "../types";
import { Icon } from "./Icon";

interface SidebarProps {
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get real user from localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const currentPath = location.pathname;

  const menuItems = [
    {
      id: "dashboard",
      path: "/dashboard",
      label: "Dashboard",
      icon: "dashboard",
      roles: ["ADMIN", "AGENT", "CLIENT"],
    },
    {
      id: "tickets",
      path: "/tickets",
      label: "Gestión de Tickets",
      icon: "confirmation_number",
      roles: ["ADMIN", "AGENT", "CLIENT"],
    },
    {
      id: "kb",
      path: "/kb",
      label: "Base de Conocimiento",
      icon: "menu_book",
      roles: ["ADMIN", "AGENT", "CLIENT"],
    },
    {
      id: "clients",
      path: "/clients",
      label: "Clientes",
      icon: "group",
      roles: ["ADMIN", "AGENT"],
    },
    {
      id: "reports",
      path: "/reports",
      label: "Reportes",
      icon: "bar_chart",
      roles: ["ADMIN"],
    },
    {
      id: "settings",
      path: "/settings",
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
            className="flex items-center gap-3 px-4 py-6 cursor-pointer group border-b border-gray-100 dark:border-gray-800"
            onClick={() => navigate("/dashboard")}
          >
            <img
              src="/logo1.png"
              alt="PuntoNet Logo"
              className="h-10 w-10 object-contain transition-transform group-hover:scale-110"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-gray-900 dark:text-white tracking-tight">
                PuntoNet
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Service Desk
              </span>
            </div>
          </div>

          <nav className="flex flex-col gap-2 mt-4">
            {menuItems
              .filter((item) => user && item.roles.includes(user.role))
              .map((item) => {
                const isActive = currentPath.startsWith(item.path);
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
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
              style={{
                backgroundImage: `url("${
                  user?.avatar || "https://ui-avatars.com/api/?name=User"
                }")`,
              }}
            ></div>
            <div className="flex flex-col text-left">
              <p className="text-gray-900 dark:text-white text-sm font-semibold leading-normal">
                {user?.name || "Usuario"}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                {user?.role || "N/A"}
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
