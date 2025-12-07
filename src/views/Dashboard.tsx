import React, { useState } from "react";
import { KPI_DATA } from "../constants";
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
  tickets: Ticket[];
  onTicketSelect: (ticketId: string) => void;
  onViewAll: () => void;
  onNavigate: (view: ViewState) => void;
  onRefresh: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  tickets,
  onTicketSelect,
  onViewAll,
  onNavigate,
  onRefresh,
}) => {
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [showCreateClient, setShowCreateClient] = useState(false);

  const recentTickets = Array.isArray(tickets) ? tickets.slice(0, 5) : [];

  // Get user info
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : { name: "Usuario" };

  // Current Date
  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Simple mock data for chart if not enough real data
  const chartData = [
    { name: "Lun", tickets: 4 },
    { name: "Mar", tickets: 3 },
    { name: "Mie", tickets: 7 },
    { name: "Jue", tickets: 5 },
    { name: "Vie", tickets: 8 },
    { name: "Sab", tickets: 2 },
    { name: "Dom", tickets: 1 },
  ];

  return (
    <div className="p-8 space-y-8 animate-fade-in relative z-0">
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
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateTicket(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
          >
            <Icon name="add" className="text-xl" />
            <span className="font-medium">Nuevo Ticket</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPI_DATA.map((kpi, idx) => (
          <div
            key={idx}
            className="group relative p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div
              className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}
            >
              <Icon name="trending_up" className="text-6xl text-primary" />
            </div>

            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {kpi.label}
            </p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-1">
              {kpi.value}
            </h3>

            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                kpi.trendColor === "green" ? "text-green-500" : "text-red-500"
              }`}
            >
              <Icon
                name={
                  kpi.trendDirection === "up" ? "trending_up" : "trending_down"
                }
              />
              <span>{kpi.trend}</span>
              <span className="text-gray-400 dark:text-gray-500 ml-1 font-normal">
                vs mes anterior
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Actividad Semanal
            </h2>
            <select className="bg-gray-50 dark:bg-gray-700 border-none rounded-lg text-sm px-3 py-1 text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-primary/50">
              <option>Esta Semana</option>
              <option>Semana Pasada</option>
            </select>
          </div>
          <div className="h-[300px] w-full" style={{ minHeight: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
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
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Status */}
        <div className="space-y-6">
          {/* Quick Stats or Actions */}
          <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-black/10 rounded-full blur-xl"></div>

            <h3 className="text-lg font-bold mb-4 relative z-10">
              Estado del Sistema
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Servidores</span>
                <span className="bg-green-400/20 text-green-100 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>{" "}
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Base de Datos</span>
                <span className="bg-green-400/20 text-green-100 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>{" "}
                  Online
                </span>
              </div>
              <div className="w-full bg-blue-900/30 rounded-full h-1.5 mt-2">
                <div className="bg-white/80 h-1.5 rounded-full w-[98%]"></div>
              </div>
              <p className="text-xs text-blue-200 mt-1">Uptime: 99.9%</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Accesos Rápidos
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowCreateTicket(true)}
                className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-colors flex flex-col items-center gap-2 group"
              >
                <Icon
                  name="add_circle"
                  className="text-2xl text-gray-400 group-hover:text-primary transition-colors"
                />
                <span className="text-xs font-medium">Crear Ticket</span>
              </button>
              <button
                onClick={onViewAll}
                className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-colors flex flex-col items-center gap-2 group"
              >
                <Icon
                  name="list_alt"
                  className="text-2xl text-gray-400 group-hover:text-primary transition-colors"
                />
                <span className="text-xs font-medium">Ver Todos</span>
              </button>
              <button
                onClick={() => setShowCreateClient(true)}
                className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-colors flex flex-col items-center gap-2 group"
              >
                <Icon
                  name="person_add"
                  className="text-2xl text-gray-400 group-hover:text-primary transition-colors"
                />
                <span className="text-xs font-medium">Nuevo Cliente</span>
              </button>
              <button
                onClick={() => onNavigate("settings")}
                className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-colors flex flex-col items-center gap-2 group"
              >
                <Icon
                  name="settings"
                  className="text-2xl text-gray-400 group-hover:text-primary transition-colors"
                />
                <span className="text-xs font-medium">Ajustes</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Tickets Recientes
          </h2>
          <button
            onClick={onViewAll}
            className="text-primary text-sm font-semibold hover:underline"
          >
            Ver todos los tickets
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-gray-700/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Asunto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Asignado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => onTicketSelect(ticket.id)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    TK-{ticket.id.substring(0, 4)}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                    {ticket.subject}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ticket.priority === "HIGH" ||
                        ticket.priority === "CRITICAL"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          : ticket.priority === "MEDIUM"
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      }`}
                    >
                      {ticket.priority === "LOW"
                        ? "Baja"
                        : ticket.priority === "MEDIUM"
                        ? "Media"
                        : ticket.priority === "HIGH"
                        ? "Alta"
                        : ticket.priority === "CRITICAL"
                        ? "Crítica"
                        : ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {ticket.status === "OPEN"
                      ? "Abierto"
                      : ticket.status === "IN_PROGRESS"
                      ? "En Progreso"
                      : ticket.status === "RESOLVED"
                      ? "Resuelto"
                      : ticket.status === "CLOSED"
                      ? "Cerrado"
                      : ticket.status}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 bg-cover"
                        style={{
                          backgroundImage: `url("${
                            ticket.assignee?.avatar ||
                            "https://ui-avatars.com/api/?name=U"
                          }")`,
                        }}
                      ></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {ticket.assignee?.name || "Unassigned"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateTicketModal
        isOpen={showCreateTicket}
        onClose={() => setShowCreateTicket(false)}
        onCreate={async (data) => {
          try {
            const userStr = localStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;
            if (user) {
              await api.post("/tickets", {
                ...data,
                creatorId: user.id,
                status: "OPEN",
              });
              onRefresh();
              setShowCreateTicket(false);
            }
          } catch (error) {
            console.error("Error creating ticket:", error);
          }
        }}
      />

      <CreateClientModal
        isOpen={showCreateClient}
        onClose={() => setShowCreateClient(false)}
        onCreate={async (data) => {
          setShowCreateClient(false);
        }}
        onEdit={async () => {}}
        clientToEdit={null}
      />
    </div>
  );
};
