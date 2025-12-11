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
import { Icon } from "@/components/Icon";
import api from "../lib/api";

interface DashboardStats {
  tickets: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  users: { total: number; clients: number; agents: number };
  knowledgeBase: { published: number };
}

interface StatusData {
  status: string;
  count: number;
}
interface PriorityData {
  priority: string;
  count: number;
}
interface TimelineData {
  date: string;
  count: number;
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

  const statusLabels: Record<string, string> = {
    OPEN: "Abiertos",
    IN_PROGRESS: "En Progreso",
    RESOLVED: "Resueltos",
    CLOSED: "Cerrados",
  };
  const priorityLabels: Record<string, string> = {
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta",
    CRITICAL: "Crítica",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Cargando reportes...
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Tickets",
      value: stats?.tickets.total || 0,
      icon: "confirmation_number",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Resueltos",
      value: stats?.tickets.resolved || 0,
      icon: "task_alt",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      label: "En Progreso",
      value: stats?.tickets.inProgress || 0,
      icon: "pending",
      gradient: "from-orange-500 to-amber-600",
    },
    {
      label: "Total Usuarios",
      value: stats?.users.total || 0,
      icon: "group",
      gradient: "from-purple-500 to-violet-600",
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reportes y Estadísticas
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Análisis completo del sistema
          </p>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
            className="px-4 py-2 rounded-xl text-sm bg-white/80 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 text-gray-900 dark:text-white"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
            className="px-4 py-2 rounded-xl text-sm bg-white/80 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 text-gray-900 dark:text-white"
          />
          <button
            onClick={() => setDateRange({ start: "", end: "" })}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`relative rounded-2xl p-6 text-white overflow-hidden bg-gradient-to-br ${card.gradient}`}
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">
                  {card.label}
                </p>
                <h3 className="text-3xl font-bold mt-1">{card.value}</h3>
              </div>
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon name={card.icon} className="text-2xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="rounded-2xl backdrop-blur-md p-6 bg-white/80 dark:bg-white/5 border border-gray-200/50 dark:border-white/10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tickets por Estado
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(e) => `${statusLabels[e.status]}: ${e.count}`}
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="rounded-2xl backdrop-blur-md p-6 bg-white/80 dark:bg-white/5 border border-gray-200/50 dark:border-white/10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tickets por Prioridad
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={priorityData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="priority"
                tickFormatter={(v) => priorityLabels[v] || v}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                labelFormatter={(v) => priorityLabels[v] || v}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="rounded-2xl backdrop-blur-md p-6 bg-white/80 dark:bg-white/5 border border-gray-200/50 dark:border-white/10">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tendencia de Tickets
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={timelineData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              axisLine={false}
            />
            <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                border: "none",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: "#3B82F6", strokeWidth: 2 }}
              name="Tickets Creados"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Agents */}
      <div className="rounded-2xl backdrop-blur-md p-6 bg-white/80 dark:bg-white/5 border border-gray-200/50 dark:border-white/10">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Agentes Destacados
        </h3>
        <div className="space-y-4">
          {topAgents.map((agent, index) => (
            <div
              key={agent.id}
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                    index === 0
                      ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                      : index === 1
                      ? "bg-gradient-to-br from-gray-300 to-gray-400"
                      : index === 2
                      ? "bg-gradient-to-br from-orange-600 to-orange-700"
                      : "bg-gradient-to-br from-blue-400 to-cyan-500"
                  }`}
                >
                  #{index + 1}
                </div>
                <div
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 bg-cover bg-center border-2 border-white dark:border-slate-700"
                  style={{
                    backgroundImage: agent.avatar
                      ? `url("${agent.avatar}")`
                      : undefined,
                  }}
                >
                  {!agent.avatar && (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold">
                      {agent.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {agent.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {agent.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
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
