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
  description: string; // Shared with backend
  client: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  assignee: User;
  lastUpdate: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  content: string; // Renamed from text to match backend
  sender: string;
  avatar: string; // Optional, might need to map from sender relationship
  timestamp: string;
  isMe: boolean; // Calculated frontend side
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
  };
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
