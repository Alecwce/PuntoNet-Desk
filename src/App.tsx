import { Suspense, lazy, useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Ticket, User } from "./types";
import api, { fetchCsrfToken } from "./lib/api";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MainLayout } from "./components/MainLayout";
import { Skeleton } from "./components/ui/Skeleton";

// Lazy load views for better performance
const Login = lazy(() =>
  import("./views/Login").then((module) => ({ default: module.Login }))
);
const TwoFactor = lazy(() =>
  import("./views/TwoFactor").then((module) => ({ default: module.TwoFactor }))
);
const Dashboard = lazy(() =>
  import("./views/Dashboard").then((module) => ({ default: module.Dashboard }))
);
const TicketList = lazy(() =>
  import("./views/TicketList").then((module) => ({
    default: module.TicketList,
  }))
);
const TicketDetail = lazy(() =>
  import("./views/TicketDetail").then((module) => ({
    default: module.TicketDetail,
  }))
);
const ServiceCatalog = lazy(() =>
  import("./views/ServiceCatalog").then((module) => ({
    default: module.ServiceCatalog,
  }))
);
const KnowledgeBase = lazy(() =>
  import("./views/KnowledgeBase").then((module) => ({
    default: module.KnowledgeBase,
  }))
);
const Clients = lazy(() =>
  import("./views/Clients").then((module) => ({ default: module.Clients }))
);
const Reports = lazy(() =>
  import("./views/Reports").then((module) => ({ default: module.Reports }))
);
const Settings = lazy(() =>
  import("./views/Settings").then((module) => ({ default: module.Settings }))
);

// Loading component
const PageLoader = () => (
  <div className="p-8 w-full max-w-7xl mx-auto space-y-4">
    <Skeleton className="h-12 w-1/3" />
    <Skeleton className="h-64 w-full" />
  </div>
);

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      await fetchCsrfToken(); // Ensure CSRF token is fetched before any API calls
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Fetch tickets
  const fetchTickets = async () => {
    try {
      const response = await api.get("/tickets?limit=5"); // Fetch recent for dashboard
      setTickets(response.data.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      // No mock tickets if API fails, just an empty array
      setTickets([]);
    }
  };

  useEffect(() => {
    // Only fetch for dashboard. TicketList fetches its own data.
    if (user && location.pathname === "/dashboard") {
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
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  );
}

export default App;
