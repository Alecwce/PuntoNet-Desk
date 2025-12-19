import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Login } from "./views/Login";
import { TwoFactor } from "./views/TwoFactor";
import { Dashboard } from "./views/Dashboard";
import { TicketList } from "./views/TicketList";
import { TicketDetail } from "./views/TicketDetail";
import { Ticket, User } from "./types";
import { MOCK_TICKETS } from "./constants";
import api, { fetchCsrfToken } from "./lib/api";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { KnowledgeBase } from "./views/KnowledgeBase";
import { Settings } from "./views/Settings";
import { Clients } from "./views/Clients";
import { Reports } from "./views/Reports";
import { MainLayout } from "./components/MainLayout";
import { ServiceCatalog } from "./views/ServiceCatalog";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);

  // Initialize user from localStorage to sync across tabs/reloads
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

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
    setUser(null);
    navigate("/login");
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            onLogin={() => {
              // Refresh user from localStorage after login
              const saved = localStorage.getItem("user");
              if (saved) setUser(JSON.parse(saved));
              handleLogin();
            }}
          />
        }
      />
      <Route path="/2fa" element={<TwoFactor onVerify={handleVerify} />} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CLIENT"]}>
            <MainLayout user={user} onLogout={handleLogout}>
              <Dashboard tickets={tickets} onRefresh={fetchTickets} />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CLIENT"]}>
            <MainLayout user={user} onLogout={handleLogout}>
              <TicketList />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets/:ticketId"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CLIENT"]}>
            <MainLayout user={user} onLogout={handleLogout}>
              <TicketDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/service-catalog"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CLIENT"]}>
            <MainLayout user={user} onLogout={handleLogout}>
              <ServiceCatalog />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/kb"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CLIENT"]}>
            <MainLayout user={user} onLogout={handleLogout}>
              <KnowledgeBase />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "AGENT", "CLIENT"]}>
            <MainLayout user={user} onLogout={handleLogout}>
              <Settings user={user} onUpdateUser={handleUpdateUser} />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/clients"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "AGENT"]}>
            <MainLayout user={user} onLogout={handleLogout}>
              <Clients />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <MainLayout user={user} onLogout={handleLogout}>
              <Reports />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
