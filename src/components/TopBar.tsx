import React from "react";
import { Icon } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";

interface TopBarProps {
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title }) => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-white/10 px-8 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
      {title ? (
        <div className="text-gray-900 dark:text-white text-xl font-bold leading-normal">
          {title}
        </div>
      ) : (
        <label className="flex flex-col min-w-40 !h-10 max-w-sm">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full overflow-hidden border border-gray-200 dark:border-white/10">
            <div className="text-gray-500 dark:text-gray-400 flex bg-gray-50 dark:bg-white/5 items-center justify-center pl-3">
              <Icon name="search" className="text-base" />
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-gray-50 dark:bg-white/5 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 pl-2 text-sm font-normal leading-normal"
              placeholder="Buscar tickets, clientes, artículos..."
            />
          </div>
        </label>
      )}

      <div className="flex items-center gap-3">
        {/* Notifications Button */}
        <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-all duration-200">
          <Icon name="notifications" />
          <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></div>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
};
