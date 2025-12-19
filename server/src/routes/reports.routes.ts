import { Router } from "express";
import {
  getDashboardStats,
  getTicketsByStatus,
  getTicketsByPriority,
  getTicketsTimeline,
  getTopAgents,
} from "../controllers/reports.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authenticate);

// FIX: Granular authorization - Dashboard stats accessible to all authenticated users
router.get("/stats", getDashboardStats);

// Admin-only routes for detailed reports
router.get("/tickets-by-status", authorize(["ADMIN"]), getTicketsByStatus);
router.get("/tickets-by-priority", authorize(["ADMIN"]), getTicketsByPriority);
router.get("/tickets-timeline", authorize(["ADMIN"]), getTicketsTimeline);
router.get("/top-agents", authorize(["ADMIN"]), getTopAgents);

export default router;
