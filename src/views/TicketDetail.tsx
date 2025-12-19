import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { CreateTicketModal } from "@/components/CreateTicketModal";
import { Select } from "@/components/ui/Select";
import api from "@/lib/api";
import { toast } from "sonner";
import { Ticket } from "../types";

export const TicketDetail: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("activity");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const canEdit = user && ["ADMIN", "SUPPORT", "AGENT"].includes(user.role);

  // Fetch ticket data
  const fetchTicket = async () => {
    if (!ticketId) return;
    try {
      const response = await api.get(`/tickets/${ticketId}`);
      setTicket(response.data);
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !ticket) return;

    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const senderId = user?.id;

      if (!senderId) {
        console.error("User not logged in");
        return;
      }

      await api.post(`/tickets/${ticket.id}/messages`, {
        content: newMessage,
        senderId,
      });
      setNewMessage("");
      fetchTicket(); // Refresh to show new message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket) return;
    try {
      await api.put(`/tickets/${ticket.id}`, { status: newStatus });
      setTicket({ ...ticket, status: newStatus as any });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!ticket) return;
    try {
      await api.put(`/tickets/${ticket.id}`, { priority: newPriority });
      setTicket({ ...ticket, priority: newPriority as any });
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  if (loading)
    return (
      <div className="p-8 flex justify-center text-gray-500">
        Cargando detalles...
      </div>
    );
  if (!ticket)
    return (
      <div className="p-8 flex justify-center text-red-500">
        Ticket no encontrado
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-background-dark">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/tickets")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400"
          >
            <Icon name="arrow_back" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                #{ticket.id.substring(0, 8)}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                ${
                  ticket.status === "OPEN"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                    : ticket.status === "IN_PROGRESS"
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                }`}
              >
                {ticket.status === "OPEN"
                  ? "Abierto"
                  : ticket.status === "IN_PROGRESS"
                  ? "En Progreso"
                  : ticket.status === "RESOLVED"
                  ? "Resuelto"
                  : ticket.status === "CLOSED"
                  ? "Cerrado"
                  : ticket.status}
              </span>
            </div>
            <h2 className="text-sm text-gray-600 dark:text-gray-300">
              {ticket.subject}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Actions for Admin */}
          {canEdit && (
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Select
                className="w-full sm:w-48"
                value={ticket.status}
                onChange={(val) => handleStatusChange(val)}
                options={[
                  {
                    value: "OPEN",
                    label: "Abierto",
                    className: "text-blue-600",
                  },
                  {
                    value: "IN_PROGRESS",
                    label: "En Progreso",
                    className: "text-yellow-600",
                  },
                  {
                    value: "RESOLVED",
                    label: "Resuelto",
                    className: "text-green-600",
                  },
                  {
                    value: "CLOSED",
                    label: "Cerrado",
                    className: "text-gray-600",
                  },
                ]}
              />

              <Select
                className="w-full sm:w-48"
                value={ticket.priority}
                onChange={(val) => handlePriorityChange(val)}
                options={[
                  {
                    value: "LOW",
                    label: "Baja",
                    icon: "info",
                    className: "text-blue-600",
                  },
                  {
                    value: "MEDIUM",
                    label: "Media",
                    icon: "info",
                    className: "text-yellow-600",
                  },
                  {
                    value: "HIGH",
                    label: "Alta",
                    icon: "warning",
                    className: "text-orange-600",
                  },
                  {
                    value: "CRITICAL",
                    label: "Crítica",
                    icon: "error",
                    className: "text-red-600",
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 mx-4 my-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-800">
            <nav className="-mb-px flex px-4 gap-4" aria-label="Tabs">
              {["details", "activity", "attachments", "kb", "history"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${
                        activeTab === tab
                          ? "border-primary text-primary"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                      }
                    `}
                  >
                    {tab === "details"
                      ? "Detalles"
                      : tab === "activity"
                      ? "Actividad/Chat"
                      : tab === "attachments"
                      ? "Adjuntos"
                      : tab === "kb"
                      ? "Base de Conocimiento"
                      : "Historial"}
                  </button>
                )
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "details" && (
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Descripción
                </h3>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {(ticket as any).description || "Sin descripción"}
                </p>

                {/* Mobile-only Ticket Info (Hidden on XL screens where Sidebar is visible) */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg xl:hidden space-y-4 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                    Información del Ticket
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        Asignado a
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px]">
                          {(ticket.assignee as any)?.name?.charAt(0) || "?"}
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {(ticket.assignee as any)?.name || "Sin asignar"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        Creado
                      </span>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {new Date((ticket as any).createdAt).toLocaleDateString(
                          "es-ES"
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        Actualizado
                      </span>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {new Date((ticket as any).updatedAt).toLocaleDateString(
                          "es-ES"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Cliente
                    </span>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {(ticket as any).creator?.name || "Desconocido"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </span>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {(ticket as any).creator?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="flex flex-col h-full">
                <div className="flex-1 space-y-4 mb-4">
                  {ticket.messages && ticket.messages.length > 0 ? (
                    ticket.messages.map((msg: any) => {
                      const currentUserStr = localStorage.getItem("user");
                      const currentUser = currentUserStr
                        ? JSON.parse(currentUserStr)
                        : {};
                      const isMe = msg.senderId === currentUser.id;

                      return (
                        <div
                          key={msg.id}
                          className={`flex ${
                            isMe ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              isMe
                                ? "bg-primary text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <span className="text-xs opacity-70 mt-1 block">
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-gray-400 text-sm py-10">
                      No hay mensajes aún.
                    </p>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={handleSendMessage}
                  className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Icon name="send" className="text-xl" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "attachments" && (
              <div className="p-4">
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Subir archivo
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      id="file-upload"
                      className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-primary file:text-white
                                  hover:file:bg-primary/90"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const userStr = localStorage.getItem("user");
                          const user = userStr ? JSON.parse(userStr) : null;
                          const uploaderId = user?.id;

                          if (!uploaderId) {
                            console.error("User not found");
                            return;
                          }

                          const formData = new FormData();
                          formData.append("file", e.target.files[0]);
                          formData.append("uploaderId", uploaderId);
                          try {
                            await api.post(
                              `/tickets/${ticketId}/attachments`,
                              formData,
                              {
                                headers: {
                                  "Content-Type": "multipart/form-data",
                                },
                              }
                            );
                            fetchTicket(); // Refresh list
                          } catch (error) {
                            console.error("Error uploading:", error);
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Archivos Adjuntos
                </h4>
                {(ticket as any).attachments &&
                (ticket as any).attachments.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {(ticket as any).attachments.map((att: any) => (
                      <li
                        key={att.id}
                        className="py-3 flex justify-between items-center"
                      >
                        <div className="flex items-center gap-3">
                          <Icon name="description" className="text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {att.filename}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(att.size / 1024).toFixed(1)} KB •{" "}
                              {new Date(att.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <a
                          href={
                            `${
                              import.meta.env.VITE_API_URL ||
                              "http://localhost:3001/api"
                            }`.replace("/api", "") + att.path
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 text-sm font-medium"
                        >
                          Descargar
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No hay archivos adjuntos.
                  </p>
                )}
              </div>
            )}

            {activeTab === "kb" && (
              <div className="p-4 space-y-6">
                <div className="relative">
                  <Icon
                    name="search"
                    className="absolute left-3 top-2.5 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Buscar soluciones en la base de conocimiento..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Icon name="lightbulb" className="text-yellow-500" />
                    Artículos Sugeridos
                  </h4>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                      <h5 className="text-primary font-medium text-sm group-hover:underline">
                        Solución de problemas de VPN
                      </h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        Guía completa para diagnosticar y resolver errores
                        comunes al conectar con la VPN corporativa (Error 619,
                        800, etc).
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] text-gray-600 dark:text-gray-400">
                          Redes
                        </span>
                        <span className="text-[10px] text-gray-400">
                          • Actualizado hace 2 días
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                      <h5 className="text-primary font-medium text-sm group-hover:underline">
                        Restablecimiento de Contraseñas del Portal
                      </h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        Pasos para restablecer contraseñas de usuarios
                        bloqueados en el portal de servicios.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] text-gray-600 dark:text-gray-400">
                          Acceso
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Icon
                  name="history"
                  className="text-5xl mb-4 mx-auto opacity-30 text-gray-400 dark:text-gray-600"
                />
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Historial de Cambios
                </h4>
                <p className="text-sm max-w-sm mx-auto">
                  Próximamente podrás ver aquí un registro detallado de todos
                  los cambios de estado, asignaciones y notas internas del
                  ticket.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-6 overflow-y-auto hidden xl:block">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
            Información del Ticket
          </h3>
          <div className="space-y-6">
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">
                Asignado a
              </span>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">
                  {(ticket.assignee as any)?.name?.charAt(0) || "?"}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {(ticket.assignee as any)?.name || "Sin asignar"}
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">
                Creado
              </span>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {new Date((ticket as any).createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">
                Última actualización
              </span>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {new Date((ticket as any).updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
