import React, { useRef, useEffect, useState } from "react";
import { Ticket } from "../../../types";
import { Icon } from "../../../components/Icon";
import api from "../../../lib/api";

interface ActivityTabProps {
  ticket: Ticket;
  refreshTicket: () => void;
}

export const ActivityTab: React.FC<ActivityTabProps> = ({
  ticket,
  refreshTicket,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [(ticket as any).messages]);

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
      refreshTicket();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 mb-4">
        {(ticket as any).messages && (ticket as any).messages.length > 0 ? (
          (ticket as any).messages.map((msg: any) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === "current-user-id" // Logic flaw in original code preserved, should strictly check user ID
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.senderId === "current-user-id"
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
          ))
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
  );
};
