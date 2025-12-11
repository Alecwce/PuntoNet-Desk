import React from "react";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      return true;
    }
    return false;
  });

  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsAnimating(true);
    setIsDarkMode(!isDarkMode);
    // Reset animation state after transition completes
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative flex items-center justify-center
        w-12 h-12 rounded-full
        backdrop-blur-md bg-white/10 dark:bg-white/5
        border border-white/20 dark:border-white/10
        hover:bg-white/20 dark:hover:bg-white/10
        hover:border-white/30 dark:hover:border-white/20
        hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-cyan-500/20
        transition-all duration-300 ease-out
        group cursor-pointer
        ${className}
      `}
      aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {/* Sun Icon */}
      <div
        className={`
          absolute inset-0 flex items-center justify-center
          transition-all duration-500 ease-out
          ${
            isDarkMode
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-50 -rotate-90"
          }
        `}
      >
        <svg
          className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>

      {/* Moon Icon */}
      <div
        className={`
          absolute inset-0 flex items-center justify-center
          transition-all duration-500 ease-out
          ${
            !isDarkMode
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-50 rotate-90"
          }
        `}
      >
        <svg
          className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>

      {/* Glow effect on toggle */}
      <div
        className={`
          absolute inset-0 rounded-full
          transition-all duration-500 ease-out
          ${isAnimating ? "animate-ping opacity-30" : "opacity-0"}
          ${isDarkMode ? "bg-yellow-400" : "bg-blue-400"}
        `}
      />

      {/* Outer ring glow on hover */}
      <div
        className={`
          absolute -inset-1 rounded-full opacity-0
          group-hover:opacity-100
          transition-opacity duration-300
          ${
            isDarkMode
              ? "bg-gradient-to-r from-yellow-400/20 to-orange-400/20"
              : "bg-gradient-to-r from-blue-400/20 to-cyan-400/20"
          }
          blur-md -z-10
        `}
      />
    </button>
  );
};
