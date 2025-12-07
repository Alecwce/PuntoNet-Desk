import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { Icon } from "./Icon";
import "highlight.js/styles/github-dark.css";

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

interface ArticleDetailModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (article: Article) => void;
  canEdit: boolean;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  isOpen,
  onClose,
  onEdit,
  canEdit,
}) => {
  if (!isOpen || !article) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/80 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <Icon
                  name="article"
                  className="text-blue-600 dark:text-blue-400 text-xl"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {article.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Icon name="person" className="text-sm" />
                    {article.author.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="visibility" className="text-sm" />
                    {article.views} vistas
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="schedule" className="text-sm" />
                    {new Date(article.createdAt).toLocaleDateString("es-ES")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canEdit && onEdit && (
                <button
                  onClick={() => onEdit(article)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Editar artículo"
                >
                  <Icon
                    name="edit"
                    className="text-gray-600 dark:text-gray-300"
                  />
                </button>
              )}
              <button
                onClick={handlePrint}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Imprimir"
              >
                <Icon
                  name="print"
                  className="text-gray-600 dark:text-gray-300"
                />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <Icon
                  name="close"
                  className="text-gray-600 dark:text-gray-300"
                />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto p-8">
            {/* Category & Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {article.category && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full font-medium">
                  {article.category}
                </span>
              )}
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Markdown Content */}
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {article.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex justify-between items-center">
              <span>
                Última actualización:{" "}
                {new Date(article.updatedAt).toLocaleString("es-ES")}
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
