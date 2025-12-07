import React, { useState } from "react";
import { Icon } from "./Icon";
import { Ticket } from "../types";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: Ticket[];
}

const COLUMN_OPTIONS = [
  { key: "id", label: "ID Ticket" },
  { key: "subject", label: "Asunto" },
  { key: "description", label: "Descripción" },
  { key: "creator", label: "Creador" },
  { key: "status", label: "Estado" },
  { key: "priority", label: "Prioridad" },
  { key: "assignee", label: "Asignado a" },
  { key: "createdAt", label: "Fecha Creación" },
  { key: "updatedAt", label: "Última Actualización" },
];

const translatePriority = (priority: string) => {
  const map: Record<string, string> = {
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta",
    CRITICAL: "Crítica",
  };
  return map[priority] || priority;
};

const translateStatus = (status: string) => {
  const map: Record<string, string> = {
    OPEN: "Abierto",
    IN_PROGRESS: "En Progreso",
    RESOLVED: "Resuelto",
    CLOSED: "Cerrado",
  };
  return map[status] || status;
};

export const ExportTicketsModal: React.FC<ExportTicketsModalProps> = ({
  isOpen,
  onClose,
  tickets,
}) => {
  const [format, setFormat] = useState("csv");
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    COLUMN_OPTIONS.map((c) => c.key)
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  if (!isOpen) return null;

  const toggleColumn = (key: string) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const getFilteredTickets = () => {
    let filtered = [...tickets];

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(
        (t) => new Date((t as any).createdAt) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      filtered = filtered.filter(
        (t) => new Date((t as any).createdAt) <= new Date(dateTo + "T23:59:59")
      );
    }

    return filtered;
  };

  const formatTicketData = (ticket: any) => {
    const row: Record<string, string> = {};

    selectedColumns.forEach((col) => {
      switch (col) {
        case "id":
          row["ID Ticket"] = `TK-${ticket.id.substring(0, 6).toUpperCase()}`;
          break;
        case "subject":
          row["Asunto"] = ticket.subject || "";
          break;
        case "description":
          row["Descripción"] = ticket.description || "";
          break;
        case "creator":
          row["Creador"] = ticket.creator?.name || "Desconocido";
          break;
        case "status":
          row["Estado"] = translateStatus(ticket.status);
          break;
        case "priority":
          row["Prioridad"] = translatePriority(ticket.priority);
          break;
        case "assignee":
          row["Asignado a"] = ticket.assignee?.name || "Sin asignar";
          break;
        case "createdAt":
          row["Fecha Creación"] = ticket.createdAt
            ? new Date(ticket.createdAt).toLocaleString("es-ES")
            : "";
          break;
        case "updatedAt":
          row["Última Actualización"] = ticket.updatedAt
            ? new Date(ticket.updatedAt).toLocaleString("es-ES")
            : "";
          break;
      }
    });

    return row;
  };

  const exportToCSV = (data: any[]) => {
    const headers = selectedColumns.map(
      (k) => COLUMN_OPTIONS.find((c) => c.key === k)?.label || k
    );
    const rows = data.map((ticket) => {
      const formatted = formatTicketData(ticket);
      return headers.map((h) => formatted[h] || "");
    });

    let csvContent = "";
    if (includeHeaders) {
      csvContent += headers.join(",") + "\n";
    }
    rows.forEach((row) => {
      csvContent += row.map((cell) => `"${cell}"`).join(",") + "\n";
    });

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, `tickets_export_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const exportToExcel = (data: any[]) => {
    const headers = selectedColumns.map(
      (k) => COLUMN_OPTIONS.find((c) => c.key === k)?.label || k
    );
    const rows = data.map((ticket) => {
      const formatted = formatTicketData(ticket);
      return headers.map((h) => formatted[h] || "");
    });

    const wsData = includeHeaders ? [headers, ...rows] : rows;
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tickets");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(
      blob,
      `tickets_export_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const exportToPDF = (data: any[]) => {
    const doc = new jsPDF();
    const headers = selectedColumns.map(
      (k) => COLUMN_OPTIONS.find((c) => c.key === k)?.label || k
    );
    const rows = data.map((ticket) => {
      const formatted = formatTicketData(ticket);
      return headers.map((h) => formatted[h] || "");
    });

    // Title
    doc.setFontSize(18);
    doc.text("Reporte de Tickets", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString("es-ES")}`, 14, 30);
    doc.text(`Total de tickets: ${data.length}`, 14, 36);

    autoTable(doc, {
      head: includeHeaders ? [headers] : undefined,
      body: rows,
      startY: 42,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    doc.save(`tickets_export_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleExport = () => {
    const data = getFilteredTickets();

    if (data.length === 0) {
      alert("No hay tickets para exportar con los filtros seleccionados");
      return;
    }

    switch (format) {
      case "csv":
        exportToCSV(data);
        break;
      case "excel":
        exportToExcel(data);
        break;
      case "pdf":
        exportToPDF(data);
        break;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        {/* Modal Panel */}
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-1.5 rounded-lg">
                <Icon name="ios_share" className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-6">
                Exportar Tickets
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <Icon name="close" className="text-xl" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Format Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Formato de Archivo
              </label>
              <div className="flex items-center gap-6">
                {[
                  { value: "csv", label: "CSV" },
                  { value: "pdf", label: "PDF" },
                  { value: "excel", label: "Excel (.xlsx)" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="format"
                      value={opt.value}
                      checked={format === opt.value}
                      onChange={() => setFormat(opt.value)}
                      className="text-primary focus:ring-primary h-4 w-4 border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Rango de Fechas (opcional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Desde
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Hasta
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Columns Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seleccionar columnas
              </label>
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3 max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
                {COLUMN_OPTIONS.map((col) => (
                  <div key={col.key} className="flex items-center gap-2 py-1.5">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(col.key)}
                      onChange={() => toggleColumn(col.key)}
                      className="rounded text-primary focus:ring-primary h-4 w-4 border-gray-300"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {col.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedColumns(COLUMN_OPTIONS.map((c) => c.key))
                  }
                  className="text-xs text-primary hover:underline"
                >
                  Seleccionar todo
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedColumns([])}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Deseleccionar todo
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeHeaders}
                onChange={() => setIncludeHeaders(!includeHeaders)}
                className="rounded text-primary focus:ring-primary h-4 w-4 border-gray-300"
              />
              <span
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                onClick={() => setIncludeHeaders(!includeHeaders)}
              >
                Incluir encabezados de columna
              </span>
            </div>

            {/* Preview count */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-300">
              <Icon name="info" className="inline mr-2" />
              Se exportarán <strong>{getFilteredTickets().length}</strong>{" "}
              tickets con <strong>{selectedColumns.length}</strong> columnas
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-lg">
            <button
              onClick={handleExport}
              disabled={selectedColumns.length === 0}
              className="inline-flex justify-center rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="download" className="mr-2" />
              Exportar
            </button>
            <button
              onClick={onClose}
              className="inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
