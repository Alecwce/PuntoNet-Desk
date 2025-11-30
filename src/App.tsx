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
      const response = await api.get("/tickets");
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      // Use mock tickets if API fails
      setTickets(MOCK_TICKETS);
    } finally {
      setLoading(false);
    }
  };

  // Authentication Flow Handlers
  const handleLogin = () => setCurrentView("2fa");
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

  // Logic to add a new ticket
  const handleAddTicket = async (data: {
    subject: string;
    priority: string;
    description: string;
  }) => {
    try {
      const response = await api.post("/tickets", {
        subject: data.subject,
        description: data.description,
        priority: data.priority,
        creatorId: "user-id-placeholder", // Should come from auth context
      });
      setTickets([response.data, ...tickets]);
      fetchTickets(); // Refresh list
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  // Logic to edit a ticket
  const handleEditTicket = async (
    id: string,
    data: { subject: string; priority: string; description: string }
  ) => {
    try {
      await api.put(`/tickets/${id}`, {
        subject: data.subject,
        priority: data.priority,
        description: data.description,
      });
      fetchTickets(); // Refresh list from server
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  // Logic to delete a ticket
  const handleDeleteTicket = async (id: string) => {
    try {
      await api.delete(`/tickets/${id}`);
      // If the deleted ticket was open in detail view, go back
      if (selectedTicketId === id) {
        handleNavigate("tickets");
      }
      fetchTickets(); // Refresh list from server
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
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
              <TicketList
                tickets={tickets}
                onTicketSelect={handleTicketSelect}
                onCreateTicket={handleAddTicket}
                onEditTicket={handleEditTicket}
                onDeleteTicket={handleDeleteTicket}
              />
            </ProtectedRoute>
          )}

          {currentView === "ticket-detail" && selectedTicketId && (
            <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CLIENT"]}>
              <TicketDetail
                ticketId={selectedTicketId}
                tickets={tickets}
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
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl mb-4">
                    construction
                  </span>
                  <h2 className="text-2xl font-semibold">
                    Página en construcción
                  </h2>
                  <p>La sección {currentView} estará disponible pronto.</p>
                </div>
              </div>
            </ProtectedRoute>
          )}

          {currentView === "reports" && (
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl mb-4">
                    construction
                  </span>
                  <h2 className="text-2xl font-semibold">
                    Página en construcción
                  </h2>
                  <p>La sección {currentView} estará disponible pronto.</p>
                </div>
              </div>
            </ProtectedRoute>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
