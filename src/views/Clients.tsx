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
  _count?: {
    ticketsCreated: number;
  };
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeMenuClientId &&
        !(event.target as Element).closest(".action-menu-trigger") &&
        !(event.target as Element).closest(".action-menu-content")
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
    } catch (error: any) {
      console.error("Error creating client:", error);
      const errorMessage =
        error.response?.data?.error || "Error al crear cliente";
      alert(errorMessage);
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
    } catch (error: any) {
      console.error("Error updating client:", error);
      const errorMessage =
        error.response?.data?.error || "Error al actualizar cliente";
      alert(errorMessage);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await api.delete(`/clients/${id}`);
      setClientToDeleteId(null);
      setIsDeleteModalOpen(false);
      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Error al eliminar cliente");
    }
  };

  const handleEditClick = (e: React.MouseEvent, client: Client) => {
    e.stopPropagation();
    setClientToEdit(client);
    setIsModalOpen(true);
    setActiveMenuClientId(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setClientToDeleteId(id);
    setIsDeleteModalOpen(true);
    setActiveMenuClientId(null);
  };

  return (
    <div className="p-8 flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
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
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Icon name="add" />
            <span>Nuevo Cliente</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="search" className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tickets Creados
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fecha de Registro
                </th>
                {isAdmin && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-gray-200"
                        style={{
                          backgroundImage: `url("${
                            client.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              client.name
                            )}&background=random`
                          }")`,
                        }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {client.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {client.email}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {client._count?.ticketsCreated || 0} tickets
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {new Date(client.createdAt).toLocaleDateString("es-ES")}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 relative">
                      <button
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-white action-menu-trigger p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuClientId(
                            activeMenuClientId === client.id ? null : client.id
                          );
                        }}
                      >
                        <Icon name="more_vert" />
                      </button>
                      {activeMenuClientId === client.id && (
                        <div className="action-menu-content absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                          <div className="py-1">
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 gap-2"
                              onClick={(e) => handleEditClick(e, client)}
                            >
                              <Icon
                                name="edit"
                                className="text-gray-500 text-base"
                              />{" "}
                              Editar
                            </button>
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 gap-2"
                              onClick={(e) => handleDeleteClick(e, client.id)}
                            >
                              <Icon name="delete" className="text-base" />{" "}
                              Eliminar
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {clients.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Icon name="people" className="text-6xl mb-4 mx-auto" />
              <p>No se encontraron clientes</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Página {page} de {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
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
