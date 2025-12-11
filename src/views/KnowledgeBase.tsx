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
  { id: "Redes", icon: "lan", color: "blue" },
  { id: "Hardware", icon: "memory", color: "purple" },
  { id: "Software", icon: "apps", color: "green" },
  { id: "Seguridad", icon: "security", color: "red" },
  { id: "VPN", icon: "vpn_key", color: "orange" },
  { id: "Email", icon: "email", color: "cyan" },
  { id: "Impresoras", icon: "print", color: "pink" },
  { id: "Otro", icon: "category", color: "gray" },
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
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (categoryFilter !== "all") params.category = categoryFilter;
      const response = await api.get("/kb", { params });
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
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
      tags: article.tags.join(", "),
      status: article.status,
    });
    setIsEditing(true);
    setShowDetail(false);
  };

  const openArticleDetail = async (article: Article) => {
    setSelectedArticle(article);
    setShowDetail(true);
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

  const getCategoryInfo = (category?: string) => {
    return CATEGORIES.find((c) => c.id === category) || CATEGORIES[7];
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 h-full animate-fade-in">
      {/* Hero Search Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 lg:p-12">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Base de Conocimientos
          </h1>
          <p className="text-blue-100 mb-6">
            Encuentra soluciones rápidas a problemas comunes
          </p>

          {/* Spotlight Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Icon name="search" className="text-gray-400 text-xl" />
            </div>
            <input
              type="text"
              placeholder="Buscar artículos, guías, tutoriales..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl text-lg
                         bg-white/95 dark:bg-slate-900/95 backdrop-blur-md
                         border-2 border-transparent focus:border-blue-400
                         text-gray-900 dark:text-white placeholder:text-gray-400
                         shadow-xl shadow-black/20
                         focus:outline-none focus:ring-4 focus:ring-blue-400/30
                         transition-all duration-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600"
              >
                <Icon name="close" />
              </button>
            )}
          </div>
        </div>

        {/* New Article Button */}
        {canEdit && (
          <button
            onClick={() => setIsCreating(true)}
            className="absolute top-6 right-6 glass-button flex items-center gap-2"
          >
            <Icon name="add" />
            Nuevo Artículo
          </button>
        )}
      </div>

      {/* Filters Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Category Pills */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
              ${
                categoryFilter === "all"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                  : "bg-white/80 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200/50 dark:border-white/10"
              }`}
          >
            <Icon name="apps" className="text-lg" />
            Todos
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                ${
                  categoryFilter === cat.id
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                    : "bg-white/80 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200/50 dark:border-white/10"
                }`}
            >
              <Icon name={cat.icon} className="text-lg" />
              {cat.id}
            </button>
          ))}
        </div>
      </div>

      {/* Tag Chips */}
      {uniqueTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all
              ${
                selectedTag === null
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
              }`}
          >
            Todos los tags
          </button>
          {uniqueTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all
                ${
                  selectedTag === tag
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pb-6">
        {filteredArticles.map((article) => {
          const catInfo = getCategoryInfo(article.category);
          return (
            <div
              key={article.id}
              onClick={() => openArticleDetail(article)}
              className="group rounded-2xl backdrop-blur-md p-6 flex flex-col cursor-pointer transition-all duration-300
                         bg-white/80 dark:bg-white/5
                         border border-gray-200/50 dark:border-white/10
                         hover:border-blue-500/30 dark:hover:border-blue-400/30
                         hover:shadow-xl hover:shadow-blue-500/10
                         hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-${catInfo.color}-500/20`}>
                  <Icon
                    name={catInfo.icon}
                    className={`text-${catInfo.color}-500 text-xl`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full
                    ${
                      article.status === "DRAFT"
                        ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                        : ""
                    }
                    ${
                      article.status === "PUBLISHED"
                        ? "bg-green-500/20 text-green-600 dark:text-green-400"
                        : ""
                    }
                    ${
                      article.status === "ARCHIVED"
                        ? "bg-gray-500/20 text-gray-600 dark:text-gray-400"
                        : ""
                    }
                  `}
                  >
                    {article.status === "DRAFT" && "Borrador"}
                    {article.status === "PUBLISHED" && "Publicado"}
                    {article.status === "ARCHIVED" && "Archivado"}
                  </span>
                  {canEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(article.id);
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Icon name="delete" className="text-lg" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Label */}
              {article.category && (
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
                  {article.category}
                </span>
              )}

              {/* Title & Content */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {article.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                {article.content.replace(/[#*`]/g, "").substring(0, 150)}...
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3 pt-3 border-t border-gray-100 dark:border-white/5">
                <span className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-[10px] font-bold">
                    {article.author.name.charAt(0)}
                  </div>
                  {article.author.name}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="visibility" className="text-sm" />
                  {article.views}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
                {article.tags.length > 3 && (
                  <span className="px-2 py-0.5 text-gray-400 text-xs">
                    +{article.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
            <Icon
              name="article"
              className="text-4xl text-gray-300 dark:text-gray-600"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
            No se encontraron artículos
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Intenta con otros términos de búsqueda
          </p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(isCreating || isEditing) && (
        <div className="fixed inset-0 glass-overlay flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl my-8 border border-gray-200 dark:border-white/10 animate-scale-in">
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEditing ? "Editar Artículo" : "Crear Nuevo Artículo"}
              </h2>
              <button
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
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <Icon name="close" />
              </button>
            </div>
            <form
              onSubmit={isEditing ? handleEdit : handleCreate}
              className="p-6 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    required
                    className="glass-input"
                    value={newArticle.title}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoría
                  </label>
                  <select
                    className="glass-input"
                    value={newArticle.category}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, category: e.target.value })
                    }
                  >
                    <option value="">Sin categoría</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Etiquetas (separadas por coma)
                  </label>
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="vpn, red, error"
                    value={newArticle.tags}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, tags: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estado
                  </label>
                  <select
                    className="glass-input"
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
                  className="glass-button-secondary px-6 py-2.5"
                >
                  Cancelar
                </button>
                <button type="submit" className="glass-button px-6 py-2.5">
                  {isEditing ? "Guardar Cambios" : "Publicar Artículo"}
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
    </div>
  );
};
