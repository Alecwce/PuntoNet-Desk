import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { CreateTicketModal } from "../components/CreateTicketModal";
import api from "../lib/api";

interface TicketTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  category?: string;
}

// Icon mapping by category
const getCategoryIcon = (category?: string): string => {
  if (!category) return "help_outline";
  const lower = category.toLowerCase();
  if (lower.includes("acceso") || lower.includes("seguridad")) return "vpn_key";
  if (lower.includes("software") || lower.includes("aplicacion")) return "apps";
  if (lower.includes("hardware")) return "devices";
  if (lower.includes("red") || lower.includes("infraestructura"))
    return "router";
  if (lower.includes("soporte")) return "support_agent";
  return "confirmation_number";
};

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "CRITICAL":
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
    case "HIGH":
      return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800";
    case "MEDIUM":
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
    case "LOW":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    default:
      return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700";
  }
};

export const ServiceCatalog: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<TicketTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TicketTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await api.get("/ticket-templates");
      setTemplates(response.data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectService = (template: TicketTemplate) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCreateTicket = async (data: any) => {
    try {
      await api.post("/tickets", data);
      setIsModalOpen(false);
      setSelectedTemplate(null);
      // Redirect to ticket list
      navigate("/tickets");
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by category
  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    const cat = template.category || "Otros";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(template);
    return acc;
  }, {} as Record<string, TicketTemplate[]>);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Icon name="store" className="text-primary" />
            Catálogo de Servicios
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Selecciona el tipo de solicitud que necesitas
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Icon
          name="search"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Buscar servicio..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Services Grid by Category */}
      <div className="flex-1 overflow-y-auto space-y-8">
        {Object.entries(groupedTemplates).map(
          ([category, categoryTemplates]) => (
            <div key={category}>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                <div className="h-1 w-8 bg-primary rounded"></div>
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleSelectService(template)}
                    className="group bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all duration-200 p-6 cursor-pointer hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Icon
                          name={getCategoryIcon(template.category)}
                          className="text-2xl text-primary"
                        />
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(
                          template.priority
                        )}`}
                      >
                        {template.priority}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {template.name}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
                      {template.description.split("\n")[0]}
                    </p>

                    <div className="flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
                      <span>Crear solicitud</span>
                      <Icon
                        name="arrow_forward"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {filteredTemplates.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Icon name="search_off" className="text-6xl mb-4 mx-auto" />
            <p>No se encontraron servicios</p>
          </div>
        )}
      </div>

      {/* Create Ticket Modal with Template */}
      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTemplate(null);
        }}
        onCreate={handleCreateTicket}
        template={selectedTemplate || undefined}
      />
    </div>
  );
};
