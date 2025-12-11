import React, { useState, useEffect, useRef } from "react";
import { Icon } from "../components/Icon";
import { Ticket } from "../types";
import api from "../lib/api";

interface TicketDetailProps {
  ticketId: string;
  onBack: () => void;
}

export const TicketDetail: React.FC<TicketDetailProps> = ({
  ticketId,
  onBack,
}) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("activity");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTicket = async () => {
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !ticket) return;

    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user?.id) return;

      await api.post(`/tickets/${ticket.id}/messages`, {
        content: newMessage,
        senderId: user.id,
      });
      setNewMessage("");
      fetchTicket();
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && ticket) {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user?.id) return;

      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("uploaderId", user.id);
      try {
        await api.post(`/tickets/${ticketId}/attachments`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        fetchTicket();
      } catch (error) {
        console.error("Error uploading:", error);
      }
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

  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;

  return (
    <div className="flex flex-col h-full animate-fade-in bg-gray-50/50 dark:bg-black/20">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/80 dark:bg-white/5 border-b border-gray-200/50 dark:border-white/10 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 transition-all">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
          >
            <Icon name="arrow_back" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white font-mono">
                TK-{ticket.id.substring(0, 6).toUpperCase()}
              </h1>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium border border-transparent
                ${
                  ticket.status === "OPEN"
                    ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/20"
                    : ""
                }
                ${
                  ticket.status === "IN_PROGRESS"
                    ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/20"
                    : ""
                }
                ${
                  ticket.status === "RESOLVED"
                    ? "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/20"
                    : ""
                }
                ${
                  ticket.status === "CLOSED"
                    ? "bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/20"
                    : ""
                }
              `}
              >
                {ticket.status === "OPEN" && "Abierto"}
                {ticket.status === "IN_PROGRESS" && "En Progreso"}
                {ticket.status === "RESOLVED" && "Resuelto"}
                {ticket.status === "CLOSED" && "Cerrado"}
              </span>
            </div>
            <h2 className="text-sm text-gray-600 dark:text-gray-300 font-medium truncate max-w-md">
              {ticket.subject}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="glass-input !py-1.5 !text-sm !w-auto"
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="OPEN">Abierto</option>
            <option value="IN_PROGRESS">En Progreso</option>
            <option value="RESOLVED">Resuelto</option>
            <option value="CLOSED">Cerrado</option>
          </select>

          <select
            className="glass-input !py-1.5 !text-sm !w-auto"
            value={ticket.priority}
            onChange={(e) => handlePriorityChange(e.target.value)}
          >
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="CRITICAL">Crítica</option>
          </select>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden p-4 lg:p-6 gap-6">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 rounded-2xl glass-panel overflow-hidden border border-gray-200/50 dark:border-white/10 shadow-lg">
          {/* Tabs */}
          <div className="border-b border-gray-200/50 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
            <nav
              className="flex px-4 gap-1 overflow-x-auto scrollbar-hide"
              aria-label="Tabs"
            >
              {[
                { id: "activity", label: "Actividad", icon: "forum" },
                { id: "details", label: "Detalles", icon: "info" },
                { id: "attachments", label: "Adjuntos", icon: "attach_file" },
                { id: "kb", label: "Base de Conocimiento", icon: "menu_book" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-4 border-b-2 font-medium text-sm transition-all whitespace-nowrap
                    ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-white/5"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-white/5"
                    }
                  `}
                >
                  <Icon name={tab.icon} className="text-lg" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto bg-white/50 dark:bg-slate-900/50">
            {activeTab === "details" && (
              <div className="p-8 max-w-3xl mx-auto animate-fade-in-up">
                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Icon name="description" className="text-blue-500" />
                    Descripción del Problema
                  </h3>
                  <div className="p-6 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {(ticket as any).description || "Sin descripción"}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="flex flex-col h-full animate-fade-in">
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                  {ticket.messages && ticket.messages.length > 0 ? (
                    ticket.messages.map((msg: any) => {
                      const isCurrentUser = msg.senderId === currentUser?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${
                            isCurrentUser ? "justify-end" : "justify-start"
                          } animate-scale-in`}
                        >
                          <div
                            className={`flex max-w-[80%] gap-3 ${
                              isCurrentUser ? "flex-row-reverse" : ""
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white
                               ${
                                 isCurrentUser
                                   ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                                   : "bg-gradient-to-br from-gray-500 to-gray-600"
                               }`}
                            >
                              {isCurrentUser ? "Yo" : "U"}
                            </div>
                            <div
                              className={`rounded-2xl px-5 py-3 shadow-md
                               ${
                                 isCurrentUser
                                   ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none"
                                   : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-white/10 rounded-tl-none"
                               }`}
                            >
                              <p className="text-sm leading-relaxed">
                                {msg.content}
                              </p>
                              <span
                                className={`text-[10px] block mt-1 ${
                                  isCurrentUser
                                    ? "text-blue-200"
                                    : "text-gray-400"
                                }`}
                              >
                                {new Date(msg.createdAt).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <Icon name="forum" className="text-4xl mb-2 opacity-50" />
                      <p>No hay mensajes aún. ¡Inicia la conversación!</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-md">
                  <form
                    onSubmit={handleSendMessage}
                    className="flex gap-3 max-w-4xl mx-auto"
                  >
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="flex-1 rounded-xl border border-gray-200 dark:border-white/10
                                 bg-white/50 dark:bg-white/5 px-4 py-3 text-sm
                                 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                                 placeholder:text-gray-400 dark:text-white transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl
                                 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 font-medium"
                    >
                      <Icon name="send" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "attachments" && (
              <div className="p-8 max-w-3xl mx-auto animate-fade-in-up">
                <div className="mb-8 p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gray-50/50 dark:bg-white/5 text-center">
                  <Icon
                    name="cloud_upload"
                    className="text-4xl text-gray-400 mb-2"
                  />
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Subir nuevo archivo
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Arrastra y suelta o haz clic para seleccionar
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Seleccionar archivo
                  </label>
                </div>

                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Icon name="folder_open" className="text-gray-400" /> Archivos
                  Adjuntos
                </h4>
                {(ticket as any).attachments?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {(ticket as any).attachments.map((att: any) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Icon name="description" />
                          </div>
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
                          className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          Descargar
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8 italic">
                    No hay archivos adjuntos en este ticket.
                  </p>
                )}
              </div>
            )}

            {activeTab === "kb" && (
              <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                {/* KB Content Placeholder - similar to design */}
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="lightbulb" className="text-3xl text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Artículos Sugeridos
                  </h3>
                  <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                    La IA sugerirá artículos relevantes basados en el contenido
                    de este ticket.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="w-80 hidden xl:flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 space-y-6">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-100 dark:border-white/10 pb-2">
              Información
            </h3>

            <div>
              <span className="text-xs text-gray-500 font-medium">
                Asignado a
              </span>
              <div className="mt-2 flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-xs text-white font-bold border-2 border-white dark:border-slate-800 shadow-sm">
                  {(ticket.assignee as any)?.name?.charAt(0) || "?"}
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {(ticket.assignee as any)?.name || "Sin asignar"}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-500 font-medium">Cliente</span>
              <div className="mt-2 flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-xs text-white font-bold border-2 border-white dark:border-slate-800 shadow-sm">
                  {(ticket as any).creator?.name?.charAt(0) || "C"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {(ticket as any).creator?.name || "Desconocido"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {(ticket as any).creator?.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-xs text-gray-500 font-medium block mb-1">
                  Creado
                </span>
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md inline-block">
                  {new Date((ticket as any).createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block mb-1">
                  Actualizado
                </span>
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md inline-block">
                  {new Date((ticket as any).updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
