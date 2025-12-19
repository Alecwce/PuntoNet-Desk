import React, { useState, useEffect } from "react";
import { Icon } from "./Icon";
// api import removed as it is unused
import { toast } from "sonner";
import { Select } from "@/components/ui/Select";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket } from "../types";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    subject: string;
    priority: string;
    description: string;
  }) => void;
  onEdit?: (
    id: string,
    data: { subject: string; priority: string; description: string }
  ) => void;
  ticketToEdit?: Ticket | null;
  template?: {
    name: string;
    subject: string;
    description: string;
    priority: string;
    category?: string;
  };
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onEdit,
  ticketToEdit,
  template,
}) => {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "MEDIUM",
    category: "SOPORTE",
  });

  const [errors, setErrors] = useState<{
    subject?: string;
    description?: string;
  }>({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && ticketToEdit) {
      setFormData({
        subject: ticketToEdit.subject,
        priority: ticketToEdit.priority,
        description: (ticketToEdit as any).description || "",
        category: "SOPORTE",
      });
    } else if (isOpen && template) {
      // Pre-fill from template
      setFormData({
        subject: template.subject,
        description: template.description,
        priority: template.priority,
        category: template.category || "SOPORTE",
      });
    } else if (isOpen && !ticketToEdit) {
      setFormData({
        subject: "",
        description: "",
        priority: "MEDIUM",
        category: "SOPORTE",
      });
    }
    setErrors({});
  }, [isOpen, ticketToEdit, template]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { subject?: string; description?: string } = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "El asunto es obligatorio";
    }
    if (!formData.description.trim()) {
      newErrors.description = "La descripción es obligatoria";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      if (ticketToEdit && onEdit) {
        await onEdit(ticketToEdit.id, formData);
      } else {
        await onCreate(formData);
      }

      // Reset and close
      setFormData({
        subject: "",
        description: "",
        priority: "MEDIUM",
        category: "SOPORTE",
      });
      setErrors({});
      onClose();
    } catch (error) {
      toast.error("Error al procesar el ticket");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = !!ticketToEdit;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          style={{ zIndex: 9999 }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh] z-10"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 sticky top-0 z-20">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Icon
                    name={isEditMode ? "edit" : "add_circle"}
                    className="text-primary"
                  />
                  {isEditMode ? "Editar Ticket" : "Nuevo Ticket"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Complete la información para su solicitud
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Icon name="close" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 overflow-y-auto"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Asunto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData({ ...formData, subject: e.target.value });
                    if (errors.subject)
                      setErrors({ ...errors, subject: undefined });
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.subject
                      ? "border-red-500 ring-red-500/20"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all`}
                  placeholder="Ej: Error de conexión VPN"
                />
                {errors.subject && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <Icon name="error" className="text-xs" /> {errors.subject}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Select
                  label="Prioridad"
                  value={formData.priority}
                  onChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                  options={[
                    {
                      value: "LOW",
                      label: "Baja",
                      icon: "info",
                      className: "text-blue-600",
                    },
                    {
                      value: "MEDIUM",
                      label: "Media",
                      icon: "help",
                      className: "text-yellow-600",
                    },
                    {
                      value: "HIGH",
                      label: "Alta",
                      icon: "warning",
                      className: "text-orange-600",
                    },
                    {
                      value: "CRITICAL",
                      label: "Crítica",
                      icon: "error",
                      className: "text-red-600",
                    },
                  ]}
                />
                <Select
                  label="Categoría"
                  value={formData.category}
                  onChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  options={[
                    {
                      value: "SOPORTE",
                      label: "Soporte Técnico",
                      icon: "computer",
                    },
                    { value: "REDES", label: "Redes", icon: "wifi" },
                    { value: "SOFTWARE", label: "Software", icon: "code" },
                    { value: "HARDWARE", label: "Hardware", icon: "devices" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description)
                      setErrors({ ...errors, description: undefined });
                  }}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.description
                      ? "border-red-500 ring-red-500/20"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none`}
                  placeholder="Describa el problema detalladamente..."
                />
                {errors.description && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <Icon name="error" className="text-xs" />{" "}
                    {errors.description}
                  </p>
                )}
              </div>
            </form>

            {/* Footer */}
            <div className="p-6 pt-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 sticky bottom-0 z-10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 active:scale-95 rounded-lg shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {loading ? (
                  <Icon name="refresh" className="animate-spin" />
                ) : (
                  <Icon name="send" />
                )}
                {isEditMode ? "Guardar" : "Crear Ticket"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
