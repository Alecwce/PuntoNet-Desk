import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Icon } from "../components/Icon";
import api from "../lib/api";

interface DashboardStats {
  tickets: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  users: {
    total: number;
    clients: number;
    agents: number;
  };
  knowledgeBase: {
    published: number;
  };
}

interface StatusData {
  status: string;
  count: number;
  [key: string]: any;
}

interface PriorityData {
  priority: string;
  count: number;
  [key: string]: any;
}

interface TimelineData {
  date: string;
  count: number;
  [key: string]: any;
}

interface AgentData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalTickets: number;
  resolvedTickets: number;
  resolutionRate: string;
}

export const Reports: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [priorityData, setPriorityData] = useState<PriorityData[]>([]);
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
  const [topAgents, setTopAgents] = useState<AgentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  useEffect(() => {
    fetchAllData();
  }, [dateRange]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const params = {
        ...(dateRange.start && { startDate: dateRange.start }),
        ...(dateRange.end && { endDate: dateRange.end }),
      };

      const [statsRes, statusRes, priorityRes, timelineRes, agentsRes] =
        await Promise.all([
          api.get("/reports/stats", { params }),
          api.get("/reports/tickets-by-status", { params }),
          api.get("/reports/tickets-by-priority", { params }),
          api.get("/reports/tickets-timeline", {
            params: { ...params, groupBy: "day" },
          }),
          api.get("/reports/top-agents"),
        ]);

      setStats(statsRes.data);
      setStatusData(statusRes.data);
      setPriorityData(priorityRes.data);
      setTimelineData(timelineRes.data);
      setTopAgents(agentsRes.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusLabels: { [key: string]: string } = {
    OPEN: "Abiertos",
    IN_PROGRESS: "En Progreso",
    RESOLVED: "Resueltos",
    CLOSED: "Cerrados",
  };

  const priorityLabels: { [key: string]: string } = {
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta",
    CRITICAL: "Crítica",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Icon
            name="hourglass_empty"
            className="text-6xl text-gray-400 animate-pulse"
          />
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Cargando reportes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Reportes y Estadísticas
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Análisis completo del sistema
          </p>
        </div>

        {/* Date Range Filter */}
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
          </div>
          <button
            onClick={() => setDateRange({ start: "", end: "" })}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Tickets</p>
              <h3 className="text-3xl font-bold mt-2">
                {stats?.tickets.total || 0}
              </h3>
            </div>
            <Icon
              name="confirmation_number"
              className="text-5xl text-blue-200"
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Resueltos</p>
              <h3 className="text-3xl font-bold mt-2">
                {stats?.tickets.resolved || 0}
              </h3>
            </div>
            <Icon name="task_alt" className="text-5xl text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">En Progreso</p>
              <h3 className="text-3xl font-bold mt-2">
                {stats?.tickets.inProgress || 0}
              </h3>
            </div>
            <Icon name="pending" className="text-5xl text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                Total Usuarios
              </p>
              <h3 className="text-3xl font-bold mt-2">
                {stats?.users.total || 0}
              </h3>
            </div>
            <Icon name="group" className="text-5xl text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets por Estado */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Tickets por Estado
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry: any) =>
                  `${statusLabels[entry.status]}: ${entry.count}`
                }
              >
                {statusData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tickets por Prioridad */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Tickets por Prioridad
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="priority"
                tickFormatter={(value) => priorityLabels[value] || value}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => priorityLabels[value] || value}
              />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Tendencia de Tickets
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3B82F6"
              strokeWidth={2}
              name="Tickets Creados"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Agents */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Agentes Destacados
        </h3>
        <div className="space-y-4">
          {topAgents.map((agent, index) => (
            <div
              key={agent.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold">
                  #{index + 1}
                </div>
                <div
                  className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-gray-200 dark:border-gray-600"
                  style={{
                    backgroundImage: `url("${
                      agent.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        agent.name
                      )}`
                    }")`,
                  }}
                ></div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {agent.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {agent.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-8 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {agent.totalTickets}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {agent.resolvedTickets}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Resueltos
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {agent.resolutionRate}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tasa
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
