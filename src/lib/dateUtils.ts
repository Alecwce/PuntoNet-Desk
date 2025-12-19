import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Formats a date to a relative string like "hace 2 horas", "hace 3 días"
 * @param date - Date string or Date object
 * @returns Formatted relative date string in Spanish
 */
export const formatRelativeDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: es });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Fecha inválida";
  }
};

/**
 * Formats a date to "DD/MM/YYYY HH:mm" format
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export const formatDateTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "Fecha inválida";
  }
};
