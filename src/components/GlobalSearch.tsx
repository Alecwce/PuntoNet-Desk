import React, { useState, useEffect, useRef } from "react";
import { Icon } from "./Icon";
import api from "../lib/api";
import { ViewState } from "../types";

interface SearchResult {
  tickets: Array<{ id: string; subject: string; status: string }>;
  clients: Array<{ id: string; name: string; email: string }>;
}

interface GlobalSearchProps {
  onNavigate: (view: ViewState, id?: string) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const { data } = await api.get(`/search?q=${query}`);
          setResults(data);
          setIsOpen(true);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults(null);
        setIsOpen(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (view: ViewState, id: string) => {
    onNavigate(view);
    // If we had a direct way to set selected ID from here we would,
    // but usually onNavigate handles the view switch.
    // For ticket detail, App.tsx handles the selection state if we pass it,
    // but the current onNavigate signature might need checking.
    // Assuming we might need to enhance onNavigate or use a different pattern suitable for App.tsx
    // For now, we will assume onNavigate matches App.tsx's capability or we will fix App.tsx next.
    if (view === "ticket-detail") {
      // We will need to trigger the selection logic in App.tsx
      // The current GlobalSearch prop defines onNavigate as (view, id?) but App.tsx handles it slightly differently.
      // We will fix App.tsx integration in the next step.
    }
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg px-3 h-10 border border-transparent focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <Icon
          name="search"
          className={`text-base ${
            loading ? "animate-pulse text-primary" : "text-gray-400"
          }`}
        />
        <input
          className="bg-transparent border-none focus:ring-0 w-full ml-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-500"
          placeholder="Buscar tickets, clientes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults(null);
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <Icon name="close" className="text-sm" />
          </button>
        )}
      </div>

      {isOpen && results && (
        <div className="absolute top-12 left-0 w-full bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden max-h-96 overflow-y-auto z-50">
          {results.tickets.length === 0 && results.clients.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No se encontraron resultados
            </div>
          ) : (
            <>
              {results.tickets.length > 0 && (
                <div className="py-2">
                  <h4 className="text-[10px] uppercase text-gray-400 font-bold px-4 mb-1">
                    Tickets
                  </h4>
                  {results.tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => {
                        // Special handling: calling the passed handler
                        // note: we will update App.tsx to ensure it handles this param
                        (onNavigate as any)("ticket-detail", ticket.id);
                        setIsOpen(false);
                        setQuery("");
                      }}
                      className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">
                          {ticket.subject}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            ticket.status === "OPEN"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        TK-{ticket.id.substring(0, 4)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {results.clients.length > 0 && (
                <div className="py-2 border-t border-gray-100 dark:border-gray-700">
                  <h4 className="text-[10px] uppercase text-gray-400 font-bold px-4 mb-1">
                    Clientes
                  </h4>
                  {results.clients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => {
                        (onNavigate as any)("clients");
                        setIsOpen(false);
                        setQuery("");
                      }}
                      className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    >
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {client.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {client.email}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
