import { useState, useEffect, lazy, Suspense } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Login } from "./views/Login";
import { TwoFactor } from "./views/TwoFactor";
import { Loading } from "./components/Loading";
import { ViewState, Ticket } from "./types";
import { MOCK_TICKETS } from "./constants";
import api, { fetchCsrfToken } from "./lib/api";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Code splitting for main views
const Dashboard = lazy(() =>
  import("./views/Dashboard").then((module) => ({ default: module.Dashboard }))
);
const TicketList = lazy(() =>
  import("./views/TicketList").then((module) => ({ default: module.TicketList }))
);
const TicketDetail = lazy(() =>
  import("./views/TicketDetail").then((module) => ({
    default: module.TicketDetail,
  }))
);
const KnowledgeBase = lazy(() =>
  import("./views/KnowledgeBase").then((module) => ({
    default: module.KnowledgeBase,
  }))
);
const Settings = lazy(() =>
  import("./views/Settings").then((module) => ({ default: module.Settings }))
);
const Clients = lazy(() =>
  import("./views/Clients").then((module) => ({ default: module.Clients }))
);
const Reports = lazy(() =>
  import("./views/Reports").then((module) => ({ default: module.Reports }))
);

function App() {
  const [currentView, setCurrentView] = useState<ViewState>("login");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);

  useEffect(() => {
    const init = async () => {
      await fetchCsrfToken();
    };
    init();
  }, []);

  useEffect(() => {
    if (currentView === "dashboard" || currentView === "tickets") {
      fetchTickets();
    }
  }, [currentView]);

  const fetchTickets = async () => {
    try {
      const response = await api.get("/tickets?limit=5"); // Fetch recent for dashboard
      setTickets(response.data.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      // Use mock tickets if API fails
      setTickets(MOCK_TICKETS);
    }
  };

  // Authentication Flow Handlers
  const handleLogin = () => setCurrentView("dashboard");
  const handleVerify = () => setCurrentView("dashboard");
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("user");
    setCurrentView("login");
    setSelectedTicketId(null);
  };

  // Navigation Handlers
  const handleNavigate = (view: ViewState, id?: string) => {
    setCurrentView(view);
    if (view === "ticket-detail" && id) {
      setSelectedTicketId(id);
    } else if (view !== "ticket-detail") {
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
          <Suspense fallback={<Loading />}>
            {currentView === "dashboard" && (
              <Dashboard
                tickets={tickets}
                onTicketSelect={handleTicketSelect}
                onViewAll={() => setCurrentView("tickets")}
                onNavigate={handleNavigate}
                onRefresh={fetchTickets}
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
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default App;
