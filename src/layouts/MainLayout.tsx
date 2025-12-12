import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { TopBar } from "../components/TopBar";
import { useAuth } from "../context/AuthContext";

export const MainLayout: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();

  // Helper to determine view state for Sidebar highlighting from URL
  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes("/dashboard")) return "dashboard";
    if (path.includes("/tickets")) return "tickets";
    if (path.includes("/kb")) return "kb";
    if (path.includes("/clients")) return "clients";
    if (path.includes("/reports")) return "reports";
    if (path.includes("/settings")) return "settings";
    return "dashboard";
  };

  // Helper for TopBar title
  const getTopBarTitle = () => {
    const path = location.pathname;
    if (path === "/tickets") return "Gestión de Tickets";
    if (path === "/kb") return "Base de Conocimiento";
    if (path === "/clients") return "Clientes";
    if (path === "/reports") return "Reportes";
    if (path === "/settings") return "Configuración";
    if (path.includes("/tickets/") && path !== "/tickets") return undefined; // Ticket Detail handles its own title/search
    return undefined; // Dashboard handles its own or default
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar
        currentView={getCurrentView() as any} // Temporary cast until Sidebar is fully refactored
        onNavigate={() => {}} // Legacy prop replacement
        onLogout={logout}
      />

      <div className="flex flex-1 flex-col overflow-hidden relative">
        <TopBar title={getTopBarTitle()} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
