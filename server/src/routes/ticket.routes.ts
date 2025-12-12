import { Router } from "express";
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  addMessage,
} from "../controllers/ticket.controller";
import { uploadAttachment } from "../controllers/attachment.controller";
import { upload } from "../middleware/upload.middleware";
import { authenticate } from "../middleware/auth.middleware";

import { validateResource } from "../middleware/validate.middleware";
import {
  createTicketSchema,
  updateTicketSchema,
} from "../schemas/ticket.schema";

const router = Router();

// Apply authentication to all ticket routes
router.use(authenticate);

router.get("/", getTickets);
router.get("/:id", getTicketById);
router.post("/", validateResource(createTicketSchema), createTicket);
router.put("/:id", validateResource(updateTicketSchema), updateTicket);
router.delete("/:id", deleteTicket);
router.post("/:id/messages", addMessage);
router.post("/:id/attachments", upload.single("file"), uploadAttachment);

export default router;
