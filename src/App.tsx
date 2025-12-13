import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Login } from "./views/Login";
import { TwoFactor } from "./views/TwoFactor";
import { Dashboard } from "./views/Dashboard";
import { TicketList } from "./views/TicketList";
import { TicketDetail } from "./views/TicketDetail";
import { Ticket } from "./types";
import { MOCK_TICKETS } from "./constants";
import api, { fetchCsrfToken } from "./lib/api";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { KnowledgeBase } from "./views/KnowledgeBase";
import { Settings } from "./views/Settings";
import { Clients } from "./views/Clients";
import { Reports } from "./views/Reports";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);

  useEffect(() => {
    const init = async () => {
      await fetchCsrfToken();
    };
    init();
  }, []);

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

  useEffect(() => {
    if (
      location.pathname === "/dashboard" ||
      location.pathname === "/tickets"
    ) {
      fetchTickets();
    }
  }, [location.pathname]);

  // Authentication Flow Handlers
  const handleLogin = () => navigate("/dashboard");
  const handleVerify = () => navigate("/dashboard");
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("user");
    navigate("/login");
  };

  const MainLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar onLogout={handleLogout} />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <TopBar
          title={
            location.pathname === "/tickets" ? "Gestión de Tickets" : undefined
          }
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/2fa" element={<TwoFactor onVerify={handleVerify} />} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CLIENT"]}>
            <MainLayout>
              <Dashboard tickets={tickets} onRefresh={fetchTickets} />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CLIENT"]}>
            <MainLayout>
              <TicketList />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets/:ticketId"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CLIENT"]}>
            <MainLayout>
              <TicketDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/kb"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CLIENT"]}>
            <MainLayout>
              <KnowledgeBase />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CLIENT"]}>
            <MainLayout>
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/clients"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "AGENT"]}>
            <MainLayout>
              <Clients />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <MainLayout>
              <Reports />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
