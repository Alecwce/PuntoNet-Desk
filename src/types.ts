export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  createdAt?: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  client?: {
    id: string;
    name: string;
  };
  attachments?: Array<{
    id: string;
    filename: string;
    url: string;
    size: number;
    uploadedAt: string;
  }>;
  messages?: ChatMessage[];
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
