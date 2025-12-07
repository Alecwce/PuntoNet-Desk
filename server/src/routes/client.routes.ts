import { Router } from "express";
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "../controllers/client.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all clients (ADMIN and AGENT can view)
router.get("/", authorize(["ADMIN", "AGENT"]), getClients);

// Get single client by ID
router.get("/:id", authorize(["ADMIN", "AGENT"]), getClientById);

// Create new client (ADMIN only)
router.post("/", authorize(["ADMIN"]), createClient);

// Update client (ADMIN only)
router.put("/:id", authorize(["ADMIN"]), updateClient);

// Delete client (ADMIN only)
router.delete("/:id", authorize(["ADMIN"]), deleteClient);

export default router;
