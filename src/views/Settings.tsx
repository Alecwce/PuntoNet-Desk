import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { CURRENT_USER } from "../constants";
import { TwoFactorSetup } from "../components/TwoFactorSetup";
import { Icon } from "../components/Icon";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  createdAt: string;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
}

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "users">("profile");
  const [users, setUsers] = useState<User[]>([]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: CURRENT_USER.name,
    avatar: CURRENT_USER.avatar || "",
    password: "",
    confirmPassword: "",
  });

  // 2FA State
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // User Form State
  const [userFormData, setUserFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role: "CLIENT",
    avatar: "",
  });

  useEffect(() => {
    if (activeTab === "users" && CURRENT_USER.role === "ADMIN") {
      fetchUsers();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetch2FAStatus = async () => {
      try {
        const response = await api.get("/auth/2fa/status");
        setIs2FAEnabled(response.data.isTwoFactorEnabled);
      } catch (error) {
        console.error("Error fetching 2FA status:", error);
      }
    };
    fetch2FAStatus();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      profileData.password &&
      profileData.password !== profileData.confirmPassword
    ) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      await api.put(`/users/${CURRENT_USER.id}`, {
        name: profileData.name,
        avatar: profileData.avatar,
        password: profileData.password || undefined,
      });
      alert("Perfil actualizado correctamente");
      setProfileData({ ...profileData, password: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error al actualizar el perfil");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.name || !userFormData.email || !userFormData.password) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }
    try {
      await api.post("/users", userFormData);
      alert("Usuario creado correctamente");
      setIsCreateModalOpen(false);
      setUserFormData({
        name: "",
        email: "",
        password: "",
        role: "CLIENT",
        avatar: "",
      });
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.error || "Error al crear usuario");
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit) return;
    try {
      await api.patch(`/users/${userToEdit.id}`, {
        name: userFormData.name,
        email: userFormData.email,
        role: userFormData.role,
        avatar: userFormData.avatar || null,
        password: userFormData.password || undefined,
      });
      alert("Usuario actualizado correctamente");
      setIsEditModalOpen(false);
      setUserToEdit(null);
      setUserFormData({
        name: "",
        email: "",
        password: "",
        role: "CLIENT",
        avatar: "",
      });
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.error || "Error al actualizar usuario");
    }
  };

  const openEditModal = (user: User) => {
    setUserToEdit(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      avatar: user.avatar || "",
    });
    setIsEditModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/users/${userToDelete}`);
      alert("Usuario eliminado correctamente");
      fetchUsers();
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      alert(
        `Error al eliminar usuario: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 h-full animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Configuración
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestiona tu perfil y preferencias
          </p>
        </div>
      </div>

      <div className="flex border-b border-gray-200/50 dark:border-white/10">
        <button
          className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${
            activeTab === "profile"
              ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-transparent"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Mi Perfil
        </button>
        {CURRENT_USER.role === "ADMIN" && (
          <button
            className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${
              activeTab === "users"
                ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-transparent"
            }`}
            onClick={() => setActiveTab("users")}
          >
            Gestión de Usuarios
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl animate-fade-in-up">
            <div className="glass-panel p-8 rounded-2xl border border-gray-200/50 dark:border-white/10">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Icon name="badge" className="text-blue-500" />
                Información Personal
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="relative group">
                  <div
                    className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 bg-cover bg-center shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300"
                    style={{
                      backgroundImage: `url("${
                        profileData.avatar ||
                        "https://ui-avatars.com/api/?name=" + profileData.name
                      }")`,
                    }}
                  ></div>
                  <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-1.5 rounded-lg shadow-sm border border-gray-100 dark:border-white/10">
                    <Icon name="edit" className="text-xs text-gray-500" />
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                    URL del Avatar
                  </label>
                  <input
                    type="text"
                    className="glass-input"
                    value={profileData.avatar}
                    onChange={(e) =>
                      setProfileData({ ...profileData, avatar: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    className="glass-input"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      className="glass-input"
                      value={profileData.password}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          password: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      className="glass-input"
                      value={profileData.confirmPassword}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="glass-button px-6 py-2.5">
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>

            {/* 2FA Security Section */}
            <div className="glass-panel p-8 rounded-2xl border border-gray-200/50 dark:border-white/10 h-fit">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Icon name="security" className="text-green-500" />
                Seguridad Extra
              </h2>
              <TwoFactorSetup
                isEnabled={is2FAEnabled}
                onStatusChange={setIs2FAEnabled}
              />
            </div>
          </div>
        )}

        {activeTab === "users" && CURRENT_USER.role === "ADMIN" && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="group" className="text-purple-500" />
                Usuarios del Sistema
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="glass-button flex items-center gap-2"
              >
                <Icon name="person_add" />
                Crear Usuario
              </button>
            </div>

            <div className="rounded-2xl backdrop-blur-md overflow-hidden bg-white/80 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50 dark:bg-white/5">
                    <tr>
                      {["Usuario", "Email", "Rol", "Registro", "Acciones"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-blue-50/50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-xl"
                                src={
                                  user.avatar ||
                                  `https://ui-avatars.com/api/?name=${user.name}`
                                }
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${
                              user.role === "ADMIN"
                                ? "bg-purple-500/20 text-purple-700 dark:text-purple-300"
                                : ""
                            }
                            ${
                              user.role === "AGENT"
                                ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                                : ""
                            }
                            ${
                              user.role === "CLIENT"
                                ? "bg-green-500/20 text-green-700 dark:text-green-300"
                                : ""
                            }
                          `}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex gap-3">
                            <button
                              onClick={() => openEditModal(user)}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteClick(user.id)}
                              className="text-red-600 dark:text-red-400 hover:underline"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals - Shared styling */}
      {(isCreateModalOpen || (isEditModalOpen && userToEdit)) && (
        <div className="fixed inset-0 glass-overlay flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200 dark:border-white/10 animate-scale-in">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {isCreateModalOpen ? "Crear Nuevo Usuario" : "Editar Usuario"}
            </h3>
            <form
              onSubmit={isCreateModalOpen ? handleCreateUser : handleEditUser}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  className="glass-input"
                  value={userFormData.name}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="glass-input"
                  value={userFormData.email}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                  {isCreateModalOpen ? "Contraseña *" : "Nueva Contraseña"}
                </label>
                <input
                  type="password"
                  required={isCreateModalOpen}
                  className="glass-input"
                  value={userFormData.password}
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      password: e.target.value,
                    })
                  }
                  placeholder={
                    !isCreateModalOpen ? "Dejar en blanco para mantener" : ""
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                  Rol *
                </label>
                <select
                  required
                  className="glass-input"
                  value={userFormData.role}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, role: e.target.value })
                  }
                >
                  <option value="CLIENT">Cliente</option>
                  <option value="AGENT">Agente</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                  URL del Avatar
                </label>
                <input
                  type="text"
                  className="glass-input"
                  value={userFormData.avatar}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, avatar: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="glass-button-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="glass-button flex-1">
                  {isCreateModalOpen ? "Crear Usuario" : "Actualizar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 glass-overlay flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-200 dark:border-white/10 animate-scale-in">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
              <Icon name="warning" className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
              ¿Eliminar usuario?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center text-sm">
              Esta acción no se puede deshacer. Se eliminarán todos los datos
              asociados.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="glass-button-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteUser}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 flex-1 transition-all shadow-lg shadow-red-500/30"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
