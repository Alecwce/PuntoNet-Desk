import React from "react";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders markdown content with XSS protection
 * Sanitizes HTML to prevent script injection
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  // Sanitize content to prevent XSS attacks
  const sanitized = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "code",
      "pre",
      "a",
      "ul",
      "ol",
      "li",
      "blockquote",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ],
    ALLOWED_ATTR: ["href", "title", "target", "rel"],
  });

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        components={{
          // Open links in new tab with security
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
          // Style code blocks
          code: ({ node, className, children, ...props }) => {
            const isInline = !className?.includes("language-");
            return isInline ? (
              <code
                className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-primary"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className="block p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono overflow-x-auto"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Style blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-primary pl-4 italic text-gray-600 dark:text-gray-400"
              {...props}
            />
          ),
        }}
      >
        {sanitized}
      </ReactMarkdown>
    </div>
  );
};
