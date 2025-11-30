import React from 'react';
import { Icon } from './Icon';

interface TopBarProps {
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title }) => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-800 px-8 py-4 bg-white dark:bg-gray-900/50 shrink-0">
      {title ? (
        <div className="text-gray-900 dark:text-white text-xl font-bold leading-normal">{title}</div>
      ) : (
        <label className="flex flex-col min-w-40 !h-10 max-w-sm">
          <div className="flex w-full flex-1 items-stretch rounded-DEFAULT h-full">
            <div className="text-gray-500 flex border-none bg-background-light dark:bg-background-dark items-center justify-center pl-3 rounded-l-DEFAULT border-r-0">
              <Icon name="search" className="text-base" />
            </div>
            <input 
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-DEFAULT text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-background-light dark:bg-background-dark h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal" 
              placeholder="Buscar tickets, clientes, artículos..." 
            />
          </div>
        </label>
      )}
      
      <div className="flex items-center gap-3">
        <button className="relative flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full size-10 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
          <Icon name="notifications" />
          <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900/50"></div>
        </button>
        <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full size-10 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
          <Icon name="dark_mode" className="dark:hidden" />
          <Icon name="light_mode" className="hidden dark:inline" />
        </button>
      </div>
    </header>
  );
};
