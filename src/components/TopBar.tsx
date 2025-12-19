import React, { useState } from "react";
import { Icon } from "./Icon";
import { NotificationDropdown } from "./NotificationDropdown";
import { useNotifications } from "../hooks/useNotifications";

interface TopBarProps {
  title?: string;
  onMenuClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ title, onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useNotifications(); // Fetches and keeps count updated

  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    // Check local storage or system preference
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      return true;
    }
    return false;
  });

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-800 px-4 md:px-8 py-4 bg-white dark:bg-gray-900/50 shrink-0 gap-4 relative z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300"
        >
          <Icon name="menu" />
        </button>
        {title ? (
          <div className="text-gray-900 dark:text-white text-xl font-bold leading-normal">
            {title}
          </div>
        ) : (
          <label className="flex flex-col min-w-40 !h-10 max-w-sm">
            <div className="flex w-full flex-1 items-stretch rounded-DEFAULT h-full">
              <div className="text-gray-500 flex border-none bg-gray-50 dark:bg-gray-800 items-center justify-center pl-3 rounded-l-DEFAULT border-r-0">
                <Icon name="search" className="text-base" />
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-DEFAULT text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-gray-50 dark:bg-gray-800 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                placeholder="Buscar tickets, clientes, artículos..."
              />
            </div>
          </label>
        )}
      </div>

      <div className="flex items-center gap-3 relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full size-10 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
        >
          <Icon name="notifications" />
          {unreadCount > 0 && (
            <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900/50"></div>
          )}
        </button>

        {/* Notification Dropdown */}
        <NotificationDropdown
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />

        <button
          onClick={toggleDarkMode}
          className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full size-10 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
        >
          {isDarkMode ? <Icon name="light_mode" /> : <Icon name="dark_mode" />}
        </button>
      </div>
    </header>
  );
};
