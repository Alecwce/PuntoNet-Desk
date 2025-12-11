import React, { useState, useEffect } from "react";
import { Icon } from "@/components/Icon";
import { CreateClientModal } from "@/components/CreateClientModal";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import api from "../lib/api";

interface Client {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  _count?: { ticketsCreated: number };
}

interface PaginatedResponse {
  data: Client[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [clientToDeleteId, setClientToDeleteId] = useState<string | null>(null);
  const [activeMenuClientId, setActiveMenuClientId] = useState<string | null>(
    null
  );

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchClients();
  }, [search, page]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeMenuClientId &&
        !(event.target as Element).closest(
          ".action-menu-trigger, .action-menu-content"
        )
      ) {
        setActiveMenuClientId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenuClientId]);

  const fetchClients = async () => {
    try {
      const response = await api.get<PaginatedResponse>("/clients", {
        params: { search, page, limit: 10 },
      });
      setClients(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotal(response.data.pagination.total);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleCreateClient = async (data: {
    email: string;
    name: string;
    password: string;
  }) => {
    try {
      await api.post("/clients", data);
      setIsModalOpen(false);
      fetchClients();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      alert(err.response?.data?.error || "Error al crear cliente");
    }
  };

  const handleEditClient = async (
    id: string,
    data: { email: string; name: string; password?: string }
  ) => {
    try {
      await api.put(`/clients/${id}`, data);
      setIsModalOpen(false);
      setClientToEdit(null);
      fetchClients();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      alert(err.response?.data?.error || "Error al actualizar cliente");
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await api.delete(`/clients/${id}`);
      setClientToDeleteId(null);
      setIsDeleteModalOpen(false);
      fetchClients();
    } catch {
      alert("Error al eliminar cliente");
    }
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 h-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Clientes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {total} clientes registrados
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setClientToEdit(null);
              setIsModalOpen(true);
            }}
            className="glass-button flex items-center gap-2"
          >
            <Icon name="person_add" />
            Nuevo Cliente
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon name="search" className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          className="w-full pl-11 pr-4 py-3 rounded-xl transition-all duration-200
                     bg-white/80 dark:bg-white/5 backdrop-blur-md
                     border border-gray-200/50 dark:border-white/10
                     focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                     text-gray-900 dark:text-white placeholder:text-gray-400"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div
        className="rounded-2xl backdrop-blur-md overflow-hidden flex-1 flex flex-col
                      bg-white/80 dark:bg-white/5 border border-gray-200/50 dark:border-white/10"
      >
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/5">
                {["Cliente", "Email", "Tickets", "Registro", isAdmin && ""]
                  .filter(Boolean)
                  .map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {clients.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 5 : 4}
                    className="px-6 py-16 text-center"
                  >
                    <Icon
                      name="people"
                      className="text-5xl text-gray-300 dark:text-gray-600 mb-3"
                    />
                    <p className="text-gray-500 dark:text-gray-400">
                      No se encontraron clientes
                    </p>
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-blue-50/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 bg-cover bg-center
                                     border-2 border-white dark:border-slate-800"
                          style={{
                            backgroundImage: client.avatar
                              ? `url("${client.avatar}")`
                              : undefined,
                          }}
                        >
                          {!client.avatar && (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold">
                              {client.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {client.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {client.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-600 dark:text-blue-400">
                        <Icon name="confirmation_number" className="text-xs" />
                        {client._count?.ticketsCreated || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {new Date(client.createdAt).toLocaleDateString("es-ES")}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 relative">
                        <button
                          className="action-menu-trigger p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuClientId(
                              activeMenuClientId === client.id
                                ? null
                                : client.id
                            );
                          }}
                        >
                          <Icon name="more_vert" />
                        </button>
                        {activeMenuClientId === client.id && (
                          <div className="action-menu-content absolute right-4 top-12 w-40 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-xl border border-gray-200 dark:border-white/10 z-50 animate-scale-in">
                            <button
                              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setClientToEdit(client);
                                setIsModalOpen(true);
                                setActiveMenuClientId(null);
                              }}
                            >
                              <Icon name="edit" className="text-gray-400" />{" "}
                              Editar
                            </button>
                            <button
                              className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setClientToDeleteId(client.id);
                                setIsDeleteModalOpen(true);
                                setActiveMenuClientId(null);
                              }}
                            >
                              <Icon name="delete" /> Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200/50 dark:border-white/10 flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setClientToEdit(null);
        }}
        onCreate={handleCreateClient}
        onEdit={handleEditClient}
        clientToEdit={clientToEdit}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() =>
          clientToDeleteId && handleDeleteClient(clientToDeleteId)
        }
      />
    </div>
  );
};
