import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Login } from "./views/Login";
import { Dashboard } from "./views/Dashboard";
import { TicketList } from "./views/TicketList";
import { TicketDetailContainer } from "./views/ticket-detail/TicketDetailContainer";
import { Settings } from "./views/Settings";
import { useAuth } from "./context/AuthContext";
import { fetchCsrfToken } from "./lib/api";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchCsrfToken().catch(console.error);
  }, []);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tickets" element={<TicketList />} />
        <Route path="tickets/:id" element={<TicketDetailContainer />} />
        <Route
          path="kb"
          element={
            <div className="p-8">Base de Conocimiento (Próximamente)</div>
          }
        />
        <Route
          path="clients"
          element={
            <div className="p-8">Gestión de Clientes (Próximamente)</div>
          }
        />
        <Route
          path="reports"
          element={<div className="p-8">Reportes (Próximamente)</div>}
        />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
