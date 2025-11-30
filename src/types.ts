export interface User {
  id?: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
}

export interface Ticket {
  id: string;
  subject: string;
  client: string;
  priority: "Baja" | "Media" | "Alta" | "Crítica";
  status: "Abierto" | "En Progreso" | "Resuelto" | "Cerrado";
  assignee: User;
  lastUpdate: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: string; // 'Me' or Name
  avatar: string;
  timestamp: string;
  isMe: boolean;
}

export interface KPI {
  label: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down";
  trendColor: "green" | "red";
}

export type ViewState =
  | "login"
  | "2fa"
  | "dashboard"
  | "tickets"
  | "ticket-detail"
  | "kb"
  | "clients"
  | "reports"
  | "settings";
