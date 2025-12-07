import React, { useState, useEffect } from "react";
import { Icon } from "./Icon";

interface Client {
  id: string;
  email: string;
  name: string;
}

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { email: string; name: string; password: string }) => void;
  onEdit: (
    id: string,
    data: { email: string; name: string; password?: string }
  ) => void;
  clientToEdit: Client | null;
}

export const CreateClientModal: React.FC<CreateClientModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onEdit,
  clientToEdit,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    name: "",
    password: "",
  });

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        email: clientToEdit.email,
        name: clientToEdit.name,
        password: "",
      });
    } else {
      setFormData({
        email: "",
        name: "",
        password: "",
      });
    }
    setErrors({ email: "", name: "", password: "" });
  }, [clientToEdit, isOpen]);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "El email es requerido" }));
      return false;
    }
    if (!regex.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Email inválido" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validateName = (name: string): boolean => {
    if (!name || name.trim().length < 2) {
      setErrors((prev) => ({
        ...prev,
        name: "El nombre debe tener al menos 2 caracteres",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, name: "" }));
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!clientToEdit && !password) {
      setErrors((prev) => ({
        ...prev,
        password: "La contraseña es requerida",
      }));
      return false;
    }
    if (password && password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "La contraseña debe tener al menos 6 caracteres",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: "" }));
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(formData.email);
    const isNameValid = validateName(formData.name);
    const isPasswordValid = validatePassword(formData.password);

    if (!isEmailValid || !isNameValid || !isPasswordValid) {
      return;
    }

    if (clientToEdit) {
      const updateData: { email: string; name: string; password?: string } = {
        email: formData.email,
        name: formData.name,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      onEdit(clientToEdit.id, updateData);
    } else {
      onCreate(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        {/* Modal Panel */}
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-1.5 rounded-lg">
                <Icon name="person_add" className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-6">
                {clientToEdit ? "Editar Cliente" : "Nuevo Cliente"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <Icon name="close" className="text-xl" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Juan Pérez"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  validateName(e.target.value);
                }}
                onBlur={() => validateName(formData.name)}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="juan.perez@cliente.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  validateEmail(e.target.value);
                }}
                onBlur={() => validateEmail(formData.email)}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña{" "}
                {clientToEdit ? (
                  <span className="text-gray-400 text-xs">
                    (dejar en blanco para no cambiar)
                  </span>
                ) : (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="password"
                required={!clientToEdit}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  validatePassword(e.target.value);
                }}
                onBlur={() => validatePassword(formData.password)}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Mínimo 6 caracteres
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-lg">
            <button
              onClick={handleSubmit}
              type="button"
              className="inline-flex justify-center rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {clientToEdit ? "Guardar Cambios" : "Crear Cliente"}
            </button>
            <button
              onClick={onClose}
              type="button"
              className="inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
