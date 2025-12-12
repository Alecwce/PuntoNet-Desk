import { Router } from "express";
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "../controllers/client.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

import { validateResource } from "../middleware/validate.middleware";
import {
  createClientSchema,
  updateClientSchema,
} from "../schemas/client.schema";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all clients (ADMIN and AGENT can view)
router.get("/", authorize(["ADMIN", "AGENT"]), getClients);

// Get single client by ID
router.get("/:id", authorize(["ADMIN", "AGENT"]), getClientById);

// Create new client (ADMIN only)
router.post(
  "/",
  authorize(["ADMIN"]),
  validateResource(createClientSchema),
  createClient
);

// Update client (ADMIN only)
router.put(
  "/:id",
  authorize(["ADMIN"]),
  validateResource(updateClientSchema),
  updateClient
);

// Delete client (ADMIN only)
router.delete("/:id", authorize(["ADMIN"]), deleteClient);

export default router;
