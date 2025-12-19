import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import api from "@/lib/api";

interface KBArticle {
  id: string;
  title: string;
  content: string;
  category: string | null;
  views: number;
  updatedAt: string;
}

interface KBSectionProps {
  ticketId?: string;
}

export const KBSection: React.FC<KBSectionProps> = ({ ticketId }) => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<KBArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await api.get("/kb", {
        params: { limit: 5, status: "PUBLISHED" },
      });
      setArticles(response.data || []);
    } catch (error) {
      console.error("Error fetching KB articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      fetchArticles();
      return;
    }

    try {
      const response = await api.get("/kb", {
        params: { search: query, status: "PUBLISHED" },
      });
      setArticles(response.data || []);
    } catch (error) {
      console.error("Error searching KB:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString("es-ES");
  };

  const handleArticleClick = (articleId: string) => {
    // Navigate to KB page (in-app navigation)
    navigate("/kb");
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Icon name="search" className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar soluciones en la base de conocimiento..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="lightbulb" className="text-yellow-500" />
          {searchQuery ? "Resultados de búsqueda" : "Artículos Disponibles"}
        </h4>

        {loading ? (
          <div className="text-sm text-gray-500 text-center py-4">
            Cargando artículos...
          </div>
        ) : articles.length > 0 ? (
          <div className="space-y-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                onClick={() => handleArticleClick(article.id)}
              >
                <h5 className="text-primary font-medium text-sm group-hover:underline">
                  {article.title}
                </h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {article.content.substring(0, 150)}...
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {article.category && (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] text-gray-600 dark:text-gray-400">
                      {article.category}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400">
                    • {article.views} vistas • Actualizado{" "}
                    {formatDate(article.updatedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center py-8">
            <Icon name="info" className="text-3xl mb-2 mx-auto opacity-30" />
            <p>No se encontraron artículos</p>
          </div>
        )}
      </div>
    </div>
  );
};
