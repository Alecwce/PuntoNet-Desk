import jsPDF from "jspdf";
import { Ticket } from "../types";

export const exportTicketToPDF = (ticket: Ticket) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text("PuntoNet Service Desk", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Ticket #${ticket.id.substring(0, 8)}`, 105, 30, {
    align: "center",
  });

  // Line separator
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);

  // Ticket Details
  let y = 45;
  doc.setFontSize(10);

  // Subject
  doc.setFont("helvetica", "bold");
  doc.text("Asunto:", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(ticket.subject, 50, y);
  y += 10;

  // Status
  doc.setFont("helvetica", "bold");
  doc.text("Estado:", 20, y);
  doc.setFont("helvetica", "normal");
  const statusText =
    ticket.status === "OPEN"
      ? "Abierto"
      : ticket.status === "IN_PROGRESS"
      ? "En Progreso"
      : ticket.status === "RESOLVED"
      ? "Resuelto"
      : "Cerrado";
  doc.text(statusText, 50, y);
  y += 10;

  // Priority
  doc.setFont("helvetica", "bold");
  doc.text("Prioridad:", 20, y);
  doc.setFont("helvetica", "normal");
  const priorityText =
    ticket.priority === "LOW"
      ? "Baja"
      : ticket.priority === "MEDIUM"
      ? "Media"
      : ticket.priority === "HIGH"
      ? "Alta"
      : "Crítica";
  doc.text(priorityText, 50, y);
  y += 10;

  // Created Date
  doc.setFont("helvetica", "bold");
  doc.text("Creado:", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(
    new Date((ticket as any).createdAt).toLocaleDateString("es-ES"),
    50,
    y
  );
  y += 10;

  // Assignee
  if ((ticket as any).assignee) {
    doc.setFont("helvetica", "bold");
    doc.text("Asignado a:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text((ticket as any).assignee.name, 50, y);
    y += 10;
  }

  // Creator
  if ((ticket as any).creator) {
    doc.setFont("helvetica", "bold");
    doc.text("Creador:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text((ticket as any).creator.name, 50, y);
    y += 10;
  }

  // Line separator
  y += 5;
  doc.line(20, y, 190, y);
  y += 10;

  // Description
  doc.setFont("helvetica", "bold");
  doc.text("Descripción:", 20, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  const description = (ticket as any).description || "Sin descripción";
  const splitDescription = doc.splitTextToSize(description, 170);
  doc.text(splitDescription, 20, y);
  y += splitDescription.length * 7;

  // Messages section
  if (ticket.messages && ticket.messages.length > 0) {
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Mensajes:", 20, y);
    y += 7;

    ticket.messages.forEach((msg: any) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(
        `${msg.sender?.name || "Usuario"} - ${new Date(
          msg.createdAt
        ).toLocaleString("es-ES")}`,
        20,
        y
      );
      y += 5;

      doc.setFont("helvetica", "normal");
      const splitMessage = doc.splitTextToSize(msg.content, 170);
      doc.text(splitMessage, 25, y);
      y += splitMessage.length * 5 + 5;
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
    doc.text(
      `Generado el ${new Date().toLocaleDateString("es-ES")}`,
      105,
      doc.internal.pageSize.height - 5,
      { align: "center" }
    );
  }

  // Save
  doc.save(`Ticket_${ticket.id.substring(0, 8)}.pdf`);
};
