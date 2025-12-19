import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "./Icon";
import { useNotifications, Notification } from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { formatRelativeDate } from "../lib/dateUtils";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click away listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
      onClose();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return "check_circle";
      case "WARNING":
        return "warning";
      case "ERROR":
        return "error";
      default:
        return "info";
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return "text-green-500 bg-green-50 dark:bg-green-900/20";
      case "WARNING":
        return "text-orange-500 bg-orange-50 dark:bg-orange-900/20";
      case "ERROR":
        return "text-red-500 bg-red-50 dark:bg-red-900/20";
      default:
        return "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-14 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Notificaciones
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-xs text-primary hover:underline font-medium"
              >
                Marcar leídas
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-400">
                <Icon
                  name="progress_activity"
                  className="animate-spin text-2xl"
                />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <Icon
                  name="notifications_off"
                  className="text-4xl text-gray-300 mb-2"
                />
                <p className="text-gray-500 text-sm">
                  No tienes notificaciones
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer flex gap-3 ${
                      !notification.isRead
                        ? "bg-blue-50/30 dark:bg-blue-900/10"
                        : ""
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full h-fit shrink-0 ${getColor(
                        notification.type
                      )}`}
                    >
                      <Icon
                        name={getIcon(notification.type)}
                        className="text-xl"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          !notification.isRead
                            ? "font-semibold text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-gray-300"
                        } truncate`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-2">
                        {formatRelativeDate(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
            <button className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 font-medium py-1">
              Ver historial completo
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
