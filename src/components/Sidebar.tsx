import React, { useState } from "react";
import { Icon } from "./Icon";
import { ViewState } from "../types";
import { ThemeToggle } from "./ThemeToggle";

interface SidebarProps {
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onNavigate,
  currentView,
  onLogout,
  isOpen,
  onClose,
}) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0
          bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-white/10
          flex flex-col h-full
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Icon name="dns" className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                PuntoNet
              </h1>
              <p className="text-xs text-gray-400 font-medium tracking-wider">
                SERVICE DESK
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-auto md:hidden text-gray-500"
            >
              <Icon name="close" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
            {menuItems
              .filter(
                (item) =>
                  !item.roles || (user && item.roles.includes(user.role))
              )
              .map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id as ViewState);
                      onClose();
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                      ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white border border-transparent"
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
                    )}
                    <Icon
                      name={item.icon}
                      className={`text-xl transition-colors ${
                        isActive
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                      }`}
                    />
                    <span
                      className={`font-medium ${isActive ? "font-bold" : ""}`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
          </nav>

          {/* User Profile */}
          <div className="mt-auto pt-6 border-t border-gray-200/50 dark:border-white/10">
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-white/5 dark:to-white/10 p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 p-0.5">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-bold text-blue-500">
                        {user?.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Icon name="logout" className="text-sm" /> Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
