import React, { useState, useEffect } from "react";
import { Icon } from "../components/Icon";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { ArticleDetailModal } from "../components/ArticleDetailModal";
import api from "../lib/api";

interface Article {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags: string[];
  status: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
}

const CATEGORIES = [
  "Redes",
  "Hardware",
  "Software",
  "Seguridad",
  "VPN",
  "Email",
  "Impresoras",
  "Otro",
];

export const KnowledgeBase: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<Article | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    status: "PUBLISHED",
  });

  const canEdit = (() => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return user?.role === "ADMIN" || user?.role === "AGENT";
  })();

  useEffect(() => {
    fetchArticles();
  }, [search, categoryFilter]);

  const fetchArticles = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      if (categoryFilter !== "all") params.category = categoryFilter;

      const response = await api.get("/kb", { params });
      // Parse tags from JSON string to array
      const parsedArticles = response.data.map((article: any) => ({
        ...article,
        tags: parseTags(article.tags),
      }));
      setArticles(parsedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  // Helper to parse tags safely
  const parseTags = (tags: any): string[] => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    if (typeof tags === "string") {
      try {
        const parsed = JSON.parse(tags);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // If it's a comma-separated string
        return tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }
    return [];
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      await api.post("/kb", {
        ...newArticle,
        authorId: user?.id,
        tags: newArticle.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      });
      setIsCreating(false);
      setNewArticle({
        title: "",
        content: "",
        category: "",
        tags: "",
        status: "PUBLISHED",
      });
      fetchArticles();
    } catch (error) {
      console.error("Error creating article:", error);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleToEdit) return;

    try {
      await api.put(`/kb/${articleToEdit.id}`, {
        title: newArticle.title,
        content: newArticle.content,
        category: newArticle.category,
        status: newArticle.status,
        tags: newArticle.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      });
      setIsEditing(false);
      setArticleToEdit(null);
      setNewArticle({
        title: "",
        content: "",
        category: "",
        tags: "",
        status: "PUBLISHED",
      });
      fetchArticles();
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este artículo?")) {
      try {
        await api.delete(`/kb/${id}`);
        fetchArticles();
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  const openEditModal = (article: Article) => {
    setArticleToEdit(article);
    setNewArticle({
      title: article.title,
      content: article.content,
      category: article.category || "",
      tags: Array.isArray(article.tags) ? article.tags.join(", ") : "",
      status: article.status,
    });
    setIsEditing(true);
    setShowDetail(false);
  };

  const openArticleDetail = async (article: Article) => {
    setSelectedArticle(article);
    setShowDetail(true);
    // Increment view counter
    try {
      await api.patch(`/kb/${article.id}/view`);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const uniqueTags = Array.from(new Set(articles.flatMap((a) => a.tags))).slice(
    0,
    10
  );

  const filteredArticles = selectedTag
    ? articles.filter((a) => a.tags.includes(selectedTag))
    : articles;

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
      PUBLISHED:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      ARCHIVED: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
    };
    return colors[status] || colors.PUBLISHED;
  };

  return (
    <div className="p-8 flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Base de Conocimientos
        </h1>
        {canEdit && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Icon name="add" />
            <span>Nuevo Artículo</span>
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="search" className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar artículos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">Todas las categorías</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Tag Filter Chips */}
      {uniqueTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              selectedTag === null
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Todos
          </button>
          {uniqueTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedTag === tag
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(isCreating || isEditing) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl my-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {isEditing ? "Editar Artículo" : "Crear Nuevo Artículo"}
              </h2>
            </div>
            <form
              onSubmit={isEditing ? handleEdit : handleCreate}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={newArticle.title}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoría
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={newArticle.category}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, category: e.target.value })
                    }
                  >
                    <option value="">Sin categoría</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Etiquetas (separadas por coma)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="vpn, red, error"
                    value={newArticle.tags}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, tags: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estado
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={newArticle.status}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, status: e.target.value })
                    }
                  >
                    <option value="DRAFT">Borrador</option>
                    <option value="PUBLISHED">Publicado</option>
                    <option value="ARCHIVED">Archivado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contenido (Markdown)
                </label>
                <div className="h-[400px]">
                  <MarkdownEditor
                    value={newArticle.content}
                    onChange={(value) =>
                      setNewArticle({ ...newArticle, content: value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setIsEditing(false);
                    setArticleToEdit(null);
                    setNewArticle({
                      title: "",
                      content: "",
                      category: "",
                      tags: "",
                      status: "PUBLISHED",
                    });
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  {isEditing ? "Guardar Cambios" : "Guardar Artículo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Article Detail Modal */}
      <ArticleDetailModal
        article={selectedArticle}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        onEdit={openEditModal}
        canEdit={canEdit}
      />

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all p-6 flex flex-col cursor-pointer"
            onClick={() => openArticleDetail(article)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <Icon
                  name="article"
                  className="text-blue-600 dark:text-blue-400 text-xl"
                />
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${statusBadge(
                    article.status
                  )}`}
                >
                  {article.status === "DRAFT"
                    ? "Borrador"
                    : article.status === "PUBLISHED"
                    ? "Publicado"
                    : "Archivado"}
                </span>
                {canEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(article.id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Icon name="delete" />
                  </button>
                )}
              </div>
            </div>

            {article.category && (
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
                {article.category}
              </span>
            )}

            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-1">
              {article.content.replace(/[#*`]/g, "")}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
              <span className="flex items-center gap-1">
                <Icon name="person" className="text-sm" />
                {article.author.name}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="visibility" className="text-sm" />
                {article.views}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Icon name="article" className="text-6xl mb-4 mx-auto" />
          <p>No se encontraron artículos</p>
        </div>
      )}
    </div>
  );
};
