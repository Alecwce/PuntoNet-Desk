import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Login } from "./views/Login";
import { TwoFactor } from "./views/TwoFactor";
import { Dashboard } from "./views/Dashboard";
import { TicketList } from "./views/TicketList";
import { TicketDetail } from "./views/TicketDetail";
import { ViewState, Ticket } from "./types";
import { MOCK_TICKETS } from "./constants";
import api from "./lib/api";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { KnowledgeBase } from "./views/KnowledgeBase";
import { Settings } from "./views/Settings";
import { Clients } from "./views/Clients";
import { Reports } from "./views/Reports";

function App() {
  const [currentView, setCurrentView] = useState<ViewState>("login");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentView === "dashboard" || currentView === "tickets") {
      fetchTickets();
    }
  }, [currentView]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tickets?limit=5"); // Fetch recent for dashboard
      setTickets(response.data.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      // Use mock tickets if API fails
      setTickets(MOCK_TICKETS);
    } finally {
      setLoading(false);
    }
  };

  // Authentication Flow Handlers
  const handleLogin = () => setCurrentView("dashboard");
  const handleVerify = () => setCurrentView("dashboard");
  const handleLogout = () => {
    setCurrentView("login");
    setSelectedTicketId(null);
  };

  // Navigation Handlers
  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    if (view !== "ticket-detail") {
      setSelectedTicketId(null);
    }
  };

  const handleTicketSelect = (id: string) => {
    setSelectedTicketId(id);
    setCurrentView("ticket-detail");
  };

  // Render logic based on state
  if (currentView === "login") {
    return <Login onLogin={handleLogin} />;
  }

  if (currentView === "2fa") {
    return <TwoFactor onVerify={handleVerify} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 flex-col overflow-hidden relative">
        <TopBar
          title={
            currentView === "ticket-detail"
              ? undefined
              : currentView === "tickets"
              ? "Gestión de Tickets"
              : undefined
          }
        />
        <main className="flex-1 overflow-y-auto p-6">
          {currentView === "dashboard" && (
            <Dashboard
              tickets={tickets}
              onTicketSelect={handleTicketSelect}
              onViewAll={() => setCurrentView("tickets")}
            />
          )}

          {currentView === "tickets" && (
            <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CLIENT"]}>
              <TicketList onTicketSelect={handleTicketSelect} />
            </ProtectedRoute>
          )}

          {currentView === "ticket-detail" && selectedTicketId && (
            <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CLIENT"]}>
              <TicketDetail
                ticketId={selectedTicketId}
                onBack={() => handleNavigate("tickets")}
              />
            </ProtectedRoute>
          )}

          {currentView === "kb" && (
            <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CLIENT"]}>
              <KnowledgeBase />
            </ProtectedRoute>
          )}

          {currentView === "settings" && (
            <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CLIENT"]}>
              <Settings />
            </ProtectedRoute>
          )}

          {currentView === "clients" && (
            <ProtectedRoute allowedRoles={["ADMIN", "AGENT"]}>
              <Clients />
            </ProtectedRoute>
          )}

          {currentView === "reports" && (
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Reports />
            </ProtectedRoute>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
