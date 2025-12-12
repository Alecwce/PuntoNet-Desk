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

const router = Router();

router.get("/", getTickets);
router.get("/:id", getTicketById);
router.post("/", createTicket);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);
router.post("/:id/messages", addMessage);
router.post("/:id/attachments", upload.single("file"), uploadAttachment);

export default router;
