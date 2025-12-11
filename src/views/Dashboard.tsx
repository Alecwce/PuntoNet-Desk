import React, { useState, useEffect } from "react";
import { Icon } from "../components/Icon";
import { Ticket, ViewState } from "../types";
import api from "../lib/api";
import { CreateTicketModal } from "../components/CreateTicketModal";
import { CreateClientModal } from "../components/CreateClientModal";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardProps {
  onTicketSelect: (ticketId: string) => void;
  onViewAll: () => void;
  onNavigate: (view: ViewState) => void;
  onRefresh: () => void;
}

interface DashboardSummary {
  stats: {
    tickets: {
      total: number;
      open: number;
      resolved: number;
    };
    users: {
      total: number;
      clients: number;
    };
  };
  recentTickets: Ticket[];
  timeline: {
    name: string;
    date: string;
    tickets: number;
  }[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  onTicketSelect,
  onViewAll,
  onNavigate,
  onRefresh,
}) => {
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [showCreateClient, setShowCreateClient] = useState(false);

  // Real Data State
  const [data, setData] = useState<DashboardSummary | null>(null);

  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : { name: "Usuario" };

  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<DashboardSummary>(
        "/reports/dashboard-summary"
      );
      setData(response.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        "Error al cargar los datos del dashboard. Por favor intente recargar."
      );
    } finally {
      setLoading(false);
    }
  };

  const kpiIcons = [
    "confirmation_number",
    "pending_actions",
    "check_circle",
    "speed",
  ];

  // Helper to safely get stats (with 0 fallback)
  const getKpiData = () => {
    if (!data)
      return [
        {
          label: "Total Tickets",
          value: 0,
          trend: "Activos",
          trendDirection: "up",
          trendColor: "blue",
        },
        {
          label: "Abiertos",
          value: 0,
          trend: "Pendientes",
          trendDirection: "down",
          trendColor: "orange",
        },
        {
          label: "Resueltos",
          value: 0,
          trend: "Completados",
          trendDirection: "up",
          trendColor: "green",
        },
        {
          label: "Clientes",
          value: 0,
          trend: "Registrados",
          trendDirection: "up",
          trendColor: "purple",
        },
      ];

    return [
      {
        label: "Total Tickets",
        value: data.stats.tickets.total,
        trend: "Activos",
        trendDirection: "up",
        trendColor: "blue",
      },
      {
        label: "Abiertos",
        value: data.stats.tickets.open,
        trend: "Pendientes",
        trendDirection: "down",
        trendColor: "orange",
      },
      {
        label: "Resueltos",
        value: data.stats.tickets.resolved,
        trend: "Completados",
        trendDirection: "up",
        trendColor: "green",
      },
      {
        label: "Clientes",
        value: data.stats.users.clients,
        trend: "Registrados",
        trendDirection: "up",
        trendColor: "purple",
      },
    ];
  };

  const kpis = getKpiData();

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[500px] animate-fade-in">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Cargando métricas en tiempo real...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[500px] animate-fade-in">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-500">
          <Icon name="error_outline" className="text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Error de Conexión
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
          {error}
        </p>
        <button onClick={fetchDashboardData} className="glass-button">
          Intentar Nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hola, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 capitalize">
            {today}
          </p>
        </div>
        <button
          onClick={() => setShowCreateTicket(true)}
          className="glass-button flex items-center gap-2"
        >
          <Icon name="add" className="text-xl" />
          <span className="font-medium">Nuevo Ticket</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="group relative p-6 rounded-2xl glass-card hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="absolute -top-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <Icon name={kpiIcons[idx]} className="text-8xl text-primary" />
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                idx === 0
                  ? "bg-blue-500/20 text-blue-500"
                  : idx === 1
                  ? "bg-orange-500/20 text-orange-500"
                  : idx === 2
                  ? "bg-green-500/20 text-green-500"
                  : "bg-purple-500/20 text-purple-500"
              }`}
            >
              <Icon name={kpiIcons[idx]} className="text-2xl" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {kpi.label}
            </p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 mb-2">
              {kpi.value}
            </h3>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                kpi.trendColor === "green"
                  ? "text-green-500"
                  : kpi.trendColor === "blue"
                  ? "text-blue-500"
                  : "text-orange-500"
              }`}
            >
              <span>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Actividad Reciente
            </h2>
            <span className="text-xs text-gray-400 font-medium">
              Últimos 7 días
            </span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {data && data.timeline.length > 0 ? (
                <AreaChart data={data.timeline}>
                  <defs>
                    <linearGradient
                      id="colorTickets"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      backdropFilter: "blur(8px)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                    }}
                    formatter={(value: number) => [
                      `${value} Tickets`,
                      "Cantidad",
                    ]}
                    labelFormatter={(label) => `Día: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="tickets"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTickets)"
                  />
                </AreaChart>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <p>No hay datos suficientes para mostrar el gráfico</p>
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="relative rounded-2xl p-6 text-white overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-lg">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <h3 className="text-lg font-bold mb-4 relative z-10 flex items-center gap-2">
              <Icon name="dns" className="text-blue-200" /> Estado del Sistema
            </h3>
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-blue-100 text-sm">Servidores</span>
                <span className="glass-badge-success text-xs">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />{" "}
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100 text-sm">Base de Datos</span>
                <span className="glass-badge-success text-xs">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />{" "}
                  Online
                </span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-blue-200 mb-1">
                  <span>Uptime</span>
                  <span>99.9%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full w-[99%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Accesos Rápidos
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: "add_circle",
                  label: "Crear Ticket",
                  action: () => setShowCreateTicket(true),
                },
                { icon: "list_alt", label: "Ver Todos", action: onViewAll },
                {
                  icon: "person_add",
                  label: "Nuevo Cliente",
                  action: () => setShowCreateClient(true),
                },
                {
                  icon: "settings",
                  label: "Ajustes",
                  action: () => onNavigate("settings"),
                },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.action}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 flex flex-col items-center gap-2 group transition-all"
                >
                  <Icon
                    name={item.icon}
                    className="text-2xl text-gray-400 group-hover:text-blue-500"
                  />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="glass-panel overflow-hidden rounded-2xl">
        <div className="p-6 border-b border-gray-200/50 dark:border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Tickets Recientes
          </h2>
          <button
            onClick={onViewAll}
            className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
          >
            Ver todos <Icon name="arrow_forward" className="text-sm" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/5">
                {["ID", "Asunto", "Prioridad", "Estado", "Asignado"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {!data || data.recentTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <Icon name="inbox" className="text-4xl mb-2 opacity-50" />
                    <p>No hay tickets recientes</p>
                  </td>
                </tr>
              ) : (
                data.recentTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => onTicketSelect(ticket.id)}
                    className="hover:bg-blue-50/50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-gray-500 dark:text-gray-400">
                      TK-{ticket.id.substring(0, 4)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                      {ticket.subject}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          ticket.priority === "CRITICAL"
                            ? "bg-red-500/20 text-red-600"
                            : ticket.priority === "HIGH"
                            ? "bg-orange-500/20 text-orange-600"
                            : ticket.priority === "MEDIUM"
                            ? "bg-yellow-500/20 text-yellow-600"
                            : "bg-green-500/20 text-green-600"
                        }`}
                      >
                        {ticket.priority === "LOW" && "Baja"}
                        {ticket.priority === "MEDIUM" && "Media"}
                        {ticket.priority === "HIGH" && "Alta"}
                        {ticket.priority === "CRITICAL" && "Crítica"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          ticket.status === "OPEN"
                            ? "bg-blue-500/20 text-blue-600"
                            : ticket.status === "IN_PROGRESS"
                            ? "bg-purple-500/20 text-purple-600"
                            : ticket.status === "RESOLVED"
                            ? "bg-green-500/20 text-green-600"
                            : "bg-gray-500/20 text-gray-600"
                        }`}
                      >
                        {ticket.status === "OPEN" && "Abierto"}
                        {ticket.status === "IN_PROGRESS" && "En Progreso"}
                        {ticket.status === "RESOLVED" && "Resuelto"}
                        {ticket.status === "CLOSED" && "Cerrado"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 bg-cover border-2 border-white dark:border-slate-800"
                          style={{
                            backgroundImage: ticket.assignee?.avatar
                              ? `url("${ticket.assignee.avatar}")`
                              : undefined,
                          }}
                        >
                          {!ticket.assignee?.avatar && (
                            <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                              {ticket.assignee?.name?.charAt(0) || "?"}
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {ticket.assignee?.name || "Sin asignar"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateTicketModal
        isOpen={showCreateTicket}
        onClose={() => setShowCreateTicket(false)}
        onCreate={async (data) => {
          try {
            if (user) {
              await api.post("/tickets", {
                ...data,
                creatorId: user.id,
                status: "OPEN",
              });
              onRefresh();
              setShowCreateTicket(false);
              fetchDashboardData();
            }
          } catch (e) {
            console.error(e);
          }
        }}
      />
      <CreateClientModal
        isOpen={showCreateClient}
        onClose={() => setShowCreateClient(false)}
        onCreate={async () => {
          setShowCreateClient(false);
          fetchDashboardData();
        }}
        onEdit={async () => {}}
        clientToEdit={null}
      />
    </div>
  );
};
