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

// All routes require authentication and ADMIN role
router.use(authenticate);
router.use(authorize(["ADMIN"]));

// Get dashboard statistics
router.get("/stats", getDashboardStats);

// Get tickets grouped by status
router.get("/tickets-by-status", getTicketsByStatus);

// Get tickets grouped by priority
router.get("/tickets-by-priority", getTicketsByPriority);

// Get tickets timeline
router.get("/tickets-timeline", getTicketsTimeline);

// Get top performing agents
router.get("/top-agents", getTopAgents);

export default router;
