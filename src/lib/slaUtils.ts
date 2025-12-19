import { Ticket } from "../types";

export interface SLAStatus {
  hoursTotal: number;
  hoursRemaining: number;
  percentageUsed: number;
  status: "ON_TIME" | "WARNING" | "BREACHED";
  color: string;
  label: string;
}

/**
 * Define SLA hours by priority (PMBOK standard)
 */
const SLA_CONFIG = {
  LOW: 48, // 48 hours
  MEDIUM: 24, // 24 hours
  HIGH: 8, // 8 hours
  CRITICAL: 4, // 4 hours
};

/**
 * Calculate SLA status for a given ticket
 */
export const calculateSLA = (ticket: Ticket): SLAStatus => {
  if (ticket.status === "RESOLVED" || ticket.status === "CLOSED") {
    return {
      hoursTotal: 0,
      hoursRemaining: 0,
      percentageUsed: 100,
      status: "ON_TIME",
      color: "bg-green-500",
      label: "Completado",
    };
  }

  const created = new Date(ticket.createdAt).getTime();
  const now = new Date().getTime();
  const allowedHours =
    SLA_CONFIG[ticket.priority as keyof typeof SLA_CONFIG] || 24;
  const allowedMs = allowedHours * 60 * 60 * 1000;

  const elapsedMs = now - created;
  const remainingMs = allowedMs - elapsedMs;
  const remainingHours = Math.max(0, remainingMs / (1000 * 60 * 60));

  const percentageUsed = Math.min(100, (elapsedMs / allowedMs) * 100);

  let status: SLAStatus["status"] = "ON_TIME";
  let color = "bg-green-500";
  let label = `${remainingHours.toFixed(1)}h restantes`;

  if (percentageUsed >= 100) {
    status = "BREACHED";
    color = "bg-red-500 pb-red"; // Past due
    label = `Vencido hace ${Math.abs(remainingHours).toFixed(1)}h`;
  } else if (percentageUsed >= 75) {
    status = "WARNING";
    color = "bg-yellow-500";
    label = `${remainingHours.toFixed(1)}h restantes (Riesgo)`;
  }

  return {
    hoursTotal: allowedHours,
    hoursRemaining: remainingHours,
    percentageUsed,
    status,
    color,
    label,
  };
};
