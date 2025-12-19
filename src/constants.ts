// Common constants for the application
export const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export const TICKET_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
] as const;
export const USER_ROLES = ["ADMIN", "AGENT", "CLIENT"] as const;

export const CATEGORIES = [
  "Soporte Técnico",
  "Redes",
  "Hardware",
  "Software",
  "Seguridad",
  "VPN",
  "Email",
  "Impresoras",
  "Otro",
] as const;

export const KB_CATEGORIES = [
  "Redes",
  "Hardware",
  "Software",
  "Seguridad",
  "VPN",
  "Email",
  "Impresoras",
  "Otro",
] as const;

// File upload constraints
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// Polling intervals
export const NOTIFICATION_POLL_INTERVAL = 30000; // 30 seconds
export const CSRF_REFRESH_INTERVAL = 300000; // 5 minutes
