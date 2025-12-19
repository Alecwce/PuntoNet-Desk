import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import api from "../lib/api";

type SearchResult = {
  tickets: any[];
  users: any[];
  articles: any[];
};

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({
    tickets: [],
    users: [],
    articles: [],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const { data } = await api.get(
            `/search?q=${encodeURIComponent(query)}`
          );
          // Defensive: Ensure all properties are arrays even if API returns undefined
          setResults({
            tickets: data?.tickets || [],
            users: data?.users || [],
            articles: data?.articles || [],
          });
        } catch (error) {
          console.error("Search failed", error);
          // Reset to empty arrays on error
          setResults({ tickets: [], users: [], articles: [] });
        } finally {
          setLoading(false);
        }
      } else {
        setResults({ tickets: [], users: [], articles: [] });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const close = () => {
    setIsOpen(false);
    setQuery("");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    close();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/25 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <div className="relative">
                <Icon
                  name="search"
                  className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Buscar tickets, usuarios, ayuda..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </div>

              {(query === "" ||
                (results.tickets.length === 0 &&
                  results.users.length === 0 &&
                  results.articles.length === 0)) &&
                !loading && (
                  <div className="py-14 px-6 text-center text-sm sm:px-14">
                    <Icon
                      name="search"
                      className="mx-auto h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                    <p className="mt-4 font-semibold text-gray-900">
                      Comando Global (Ctrl+K)
                    </p>
                    <p className="mt-2 text-gray-500">
                      Busca tickets, usuarios o artículos de la base de
                      conocimiento rápidamente.
                    </p>
                  </div>
                )}

              {loading && (
                <div className="py-14 px-6 text-center text-sm sm:px-14">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-gray-500">Buscando...</p>
                </div>
              )}

              {/* Result Groups */}
              <div className="max-h-96 scroll-py-3 overflow-y-auto p-3">
                {results.tickets.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 px-3 text-xs font-semibold text-gray-500">
                      Tickets
                    </h3>
                    <ul className="text-sm text-gray-700">
                      {results.tickets.map((ticket) => (
                        <li
                          key={ticket.id}
                          className="group flex cursor-pointer select-none items-center rounded-md p-2 hover:bg-gray-100"
                          onClick={() =>
                            handleNavigate(`/tickets/${ticket.id}`)
                          }
                        >
                          <span
                            className={`mr-3 h-2 w-2 rounded-full ${
                              ticket.priority === "CRITICAL"
                                ? "bg-red-500"
                                : "bg-blue-500"
                            }`}
                          />
                          <div className="flex-auto truncate">
                            {ticket.subject}
                            <span className="ml-2 text-gray-400">
                              #{ticket.id.slice(0, 8)}
                            </span>
                          </div>
                          <Icon
                            name="arrow_forward"
                            className="ml-3 flex-none text-gray-400"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.users.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 px-3 text-xs font-semibold text-gray-500">
                      Usuarios
                    </h3>
                    <ul className="text-sm text-gray-700">
                      {results.users.map((user) => (
                        <li
                          key={user.id}
                          className="group flex cursor-pointer select-none items-center rounded-md p-2 hover:bg-gray-100"
                        >
                          <div className="mr-3 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary uppercase">
                            {user.name.charAt(0)}
                          </div>
                          <div className="flex-auto truncate">{user.name}</div>
                          <span className="ml-3 flex-none text-xs text-gray-400">
                            {user.email}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.articles?.length > 0 && (
                  <div>
                    <h3 className="mb-2 px-3 text-xs font-semibold text-gray-500">
                      Base de Conocimiento
                    </h3>
                    <ul className="text-sm text-gray-700">
                      {results.articles.map((article) => (
                        <li
                          key={article.id}
                          className="group flex cursor-pointer select-none items-center rounded-md p-2 hover:bg-gray-100"
                          // For now just console log as we don't have KB route yet
                          onClick={() =>
                            console.log("Open article", article.id)
                          }
                        >
                          <Icon
                            name="article"
                            className="mr-3 h-5 w-5 flex-none text-gray-400"
                          />
                          <div className="flex-auto truncate">
                            {article.title}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
