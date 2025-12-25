import React from "react";
import api from "../lib/api";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Ticket } from "../types";
import { Icon } from "../components/Icon";
import { Skeleton } from "@/components/ui/Skeleton";
import { LegalPoliciesModal } from "../components/LegalPoliciesModal";

interface DashboardProps {
  tickets: Ticket[];
  onRefresh?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ tickets, onRefresh }) => {
  const navigate = useNavigate();

  // FIX: Dashboard now fetches its own stats
  const [loading, setLoading] = React.useState(true);
  const [dashboardStats, setDashboardStats] = React.useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0,
  });

  const [chartData, setChartData] = React.useState<any[]>([]);

  // Legal Policies State
  const [isLegalModalOpen, setIsLegalModalOpen] = React.useState(false);
  const [hasAcceptedPolicies, setHasAcceptedPolicies] = React.useState(true);

  React.useEffect(() => {
    const accepted = localStorage.getItem("policiesAccepted_v1");
    if (!accepted) {
      setHasAcceptedPolicies(false);
      // Optional: Auto-open or just show indicator
      // setIsLegalModalOpen(true);
    } else {
      setHasAcceptedPolicies(true);
    }
  }, []);

  const handleAcceptPolicies = () => {
    localStorage.setItem("policiesAccepted_v1", "true");
    setHasAcceptedPolicies(true);
    setIsLegalModalOpen(false);
  };

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Assuming api is imported from lib/api, if not we use fetch or similar
        // Based on other files, api is default import from "../lib/api"
        // I will dynamically import it or assume it is available.
        // Wait, I cannot import inside useEffect.
        // I'll assume 'api' is available or import it at top (it wasn't imported in original file).
        // Original file used 'onRefresh' prop but didn't import api.
        // I need to import api. I'll add the import in a separate edit or use window.fetch if needed,
        // but best practice is to reuse the api instance.
        // For now, I'll write the logic assuming 'api' is imported.
        // Wait, I don't see 'api' imported in the original file I read.
        // I will add the import in a separate tool call to be safe.

        const { data } = await api.get("/reports/stats");
        setDashboardStats({
          total: data.tickets.total,
          open: data.tickets.open,
          inProgress: data.tickets.inProgress,
          resolved: data.tickets.resolved,
          critical: data.tickets.critical, // Using the new field we added
        });
        setChartData([
          { name: "Abiertos", value: data.tickets.open },
          { name: "En Proceso", value: data.tickets.inProgress },
          { name: "Resueltos", value: data.tickets.resolved },
        ]);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        toast.error("Error al cargar estadísticas");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [onRefresh]);

  // Sort recent tickets from props (Limit to 5 for UI)
  // OPTIMIZATION: Memoize sorting to prevent O(n log n) operation on every render
  const recentTickets = React.useMemo(() => {
    return [...tickets]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [tickets]);

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[380px] rounded-xl" />
          <Skeleton className="h-[380px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 space-y-8"
    >
      <LegalPoliciesModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        onAccept={!hasAcceptedPolicies ? handleAcceptPolicies : undefined}
      />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Dashboard
            {!hasAcceptedPolicies && (
              <span
                className="ml-3 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full animate-pulse cursor-pointer border border-red-200"
                onClick={() => setIsLegalModalOpen(true)}
              >
                Políticas Pendientes
              </span>
            )}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Resumen general del servicio
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLegalModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <Icon name="gavel" className="text-primary" />
            <span className="hidden sm:inline">Legal</span>
          </button>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Actualizar datos"
            >
              <Icon name="refresh" />
            </button>
          )}
          <button
            onClick={() => navigate("/tickets")}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Icon name="add" />
            <span>Nuevo Ticket</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <Icon name="confirmation_number" />
            </div>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              Total
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
            {dashboardStats.total}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Tickets totales
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
              <Icon name="pending" />
            </div>
            <span className="text-xs font-medium text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
              {dashboardStats.open} Pendientes
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
            {dashboardStats.inProgress}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            En progreso
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
              <Icon name="check_circle" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
              Resueltos
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
            {dashboardStats.resolved}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Resueltos
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
              <Icon name="warning" />
            </div>
            <span className="text-xs font-medium text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
              Prioridad Alta
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
            {dashboardStats.critical}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Críticos
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
            Actividad Reciente
          </h3>
          <div className="h-[300px] w-full min-w-0">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "0.5rem",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p className="text-sm">No hay datos disponibles</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Tickets List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Tickets Recientes
            </h3>
            <button
              onClick={() => navigate("/tickets")}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Ver todos
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {recentTickets.length > 0 ? (
              recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                >
                  <div
                    className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                      ticket.priority === "CRITICAL" ||
                      ticket.priority === "HIGH"
                        ? "bg-red-500"
                        : ticket.priority === "MEDIUM"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {ticket.subject}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {ticket.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                        General
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay tickets recientes
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
