import React from "react";

interface TicketTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TicketTabs: React.FC<TicketTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <nav className="-mb-px flex px-4 gap-4" aria-label="Tabs">
        {["details", "activity", "attachments", "kb", "history"].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
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
        ))}
      </nav>
    </div>
  );
};
