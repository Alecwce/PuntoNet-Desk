import * as XLSX from "xlsx";
import { Ticket } from "../types";

/**
 * Exports tickets to Excel file
 * @param tickets - Array of tickets to export
 * @param filename - Name of the file (default: tickets.xlsx)
 */
export const exportTicketsToExcel = (
  tickets: Ticket[],
  filename = "tickets.xlsx"
) => {
  // Prepare data for Excel
  const data = tickets.map((ticket) => ({
    ID: ticket.id.substring(0, 8),
    Asunto: ticket.subject,
    Descripción: ticket.description || "",
    Estado: ticket.status,
    Prioridad: ticket.priority,
    Creador: (ticket as any).creator?.name || "",
    Asignado: (ticket as any).assignee?.name || "Sin asignar",
    Creado: new Date((ticket as any).createdAt).toLocaleDateString("es-ES"),
    Actualizado: new Date((ticket as any).updatedAt).toLocaleDateString(
      "es-ES"
    ),
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data);

  // Set column widths
  ws["!cols"] = [
    { wch: 10 }, // ID
    { wch: 30 }, // Asunto
    { wch: 50 }, // Descripción
    { wch: 15 }, // Estado
    { wch: 15 }, // Prioridad
    { wch: 20 }, // Creador
    { wch: 20 }, // Asignado
    { wch: 15 }, // Creado
    { wch: 15 }, // Actualizado
  ];

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Tickets");

  // Save file
  XLSX.writeFile(wb, filename);
};
