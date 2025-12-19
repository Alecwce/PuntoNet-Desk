import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/Icon";

interface Option {
  value: string;
  label: string;
  icon?: string; // Optional icon name
  className?: string; // Optional specific styling for the option
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string; // Label for the select
  className?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  label,
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    if (!disabled) {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className} ${
        disabled ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full px-4 py-2.5 
          bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-700 
          rounded-lg cursor-pointer
          text-sm text-gray-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-primary/50
          transition-all duration-200
          ${
            isOpen
              ? "ring-2 ring-primary/50 border-primary"
              : "hover:border-gray-300 dark:hover:border-gray-600"
          }
        `}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <span className="text-gray-500 text-lg">
              <Icon name={selectedOption.icon} />
            </span>
          )}
          <span className={!selectedOption ? "text-gray-400" : ""}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <Icon
          name="expand_more"
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-auto"
          >
            <ul className="py-1">
              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`
                    px-4 py-2.5 text-sm cursor-pointer flex items-center gap-2
                    hover:bg-gray-50 dark:hover:bg-gray-700/50
                    transition-colors
                    ${
                      option.value === value
                        ? "bg-primary/5 dark:bg-primary/10 text-primary font-medium"
                        : "text-gray-700 dark:text-gray-200"
                    }
                    ${option.className || ""}
                  `}
                >
                  {option.icon && (
                    <span className="text-lg opacity-70">
                      <Icon name={option.icon} />
                    </span>
                  )}
                  {option.label}
                  {option.value === value && (
                    <Icon
                      name="check"
                      className="ml-auto text-primary text-xs"
                    />
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
