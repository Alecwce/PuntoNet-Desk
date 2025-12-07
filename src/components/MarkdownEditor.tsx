import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { Icon } from "./Icon";
import "highlight.js/styles/github-dark.css";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Escribe tu contenido en Markdown...",
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const insertMarkdown = (
    prefix: string,
    suffix = "",
    placeholder = "texto"
  ) => {
    const textarea = document.getElementById(
      "md-editor"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || placeholder;
    const newText =
      value.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      value.substring(end);

    onChange(newText);

    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: "format_bold",
      action: () => insertMarkdown("**", "**", "negrita"),
      title: "Negrita",
    },
    {
      icon: "format_italic",
      action: () => insertMarkdown("_", "_", "cursiva"),
      title: "Cursiva",
    },
    {
      icon: "format_list_bulleted",
      action: () => insertMarkdown("\n- ", "", "elemento"),
      title: "Lista",
    },
    {
      icon: "format_quote",
      action: () => insertMarkdown("\n> ", "", "cita"),
      title: "Cita",
    },
    {
      icon: "code",
      action: () => insertMarkdown("`", "`", "código"),
      title: "Código",
    },
    {
      icon: "link",
      action: () => insertMarkdown("[", "](url)", "enlace"),
      title: "Enlace",
    },
  ];

  return (
    <div className="flex flex-col h-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 px-3 py-2">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((btn, idx) => (
            <button
              key={idx}
              type="button"
              onClick={btn.action}
              title={btn.title}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <Icon
                name={btn.icon}
                className="text-gray-600 dark:text-gray-300 text-sm"
              />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              showPreview
                ? "bg-primary text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {showPreview ? "Editor" : "Vista Previa"}
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-300 dark:divide-gray-600">
        {/* Editor */}
        {!showPreview && (
          <div className="h-full md:col-span-1">
            <textarea
              id="md-editor"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-full p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none focus:outline-none"
            />
          </div>
        )}

        {/* Preview */}
        {(showPreview || window.innerWidth >= 768) && (
          <div className="h-full overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50 prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {value || "_Vista previa vacía..._"}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 px-3 py-2 text-xs text-gray-500">
        <span>{value.length} caracteres</span>
      </div>
    </div>
  );
};
