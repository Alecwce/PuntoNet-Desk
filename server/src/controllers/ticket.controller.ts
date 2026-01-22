import { Request, Response } from "express";
import { prisma } from "../index";
import { Prisma } from "@prisma/client";
import { notify, notifyMany } from "./notification.controller";

export const getTickets = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string; // Status enum value
    const priority = req.query.priority as string; // Priority enum value

    const skip = (page - 1) * limit;

    const where: Prisma.TicketWhereInput = {};

    if (status && status !== "ALL") {
      // Assuming specific status passed. If strictly typed, cast to enum.
      where.status = status as any;
    }

    if (priority && priority !== "ALL") {
      where.priority = priority as any;
    }

    // RBAC: Client can only see their own tickets
    const user = req.user;
    if (user && user.role === "CLIENT") {
      where.creatorId = user.id;
    }

    if (search) {
      where.OR = [
        { subject: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        // Search by ID is exact or partial depending on DB support, usually partial for string IDs
        { id: { contains: search, mode: "insensitive" } },
        { creator: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: { assignee: true, creator: true },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.ticket.count({ where }),
    ]);

    res.json({
      data: tickets,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        assignee: true,
        creator: true,
        messages: {
          include: { sender: true },
          orderBy: { createdAt: "asc" },
        },
        attachments: true,
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // RBAC: Check authorization
    if (user.role === "CLIENT" && ticket.creatorId !== user.id) {
      return res
        .status(403)
        .json({ error: "Forbidden: You cannot access this ticket" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  const { subject, description, priority } = req.body;
  const user = (req as any).user;

  if (!user || !user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const ticket = await prisma.ticket.create({
      data: {
        subject,
        description,
        priority,
        creatorId: user.id,
        status: "OPEN",
      },
      include: { assignee: true, creator: true },
    });

    // Notify Admins
    try {
      const staff = await prisma.user.findMany({
        where: { role: { in: ["ADMIN", "AGENT"] } },
        select: { id: true },
      });

      const recipientIds = staff
        .filter((member) => member.id !== user.id)
        .map((member) => member.id);

      if (recipientIds.length > 0) {
        await notifyMany(
          recipientIds,
          "Nuevo Ticket",
          `Ticket #${ticket.subject} creado por ${user.name || "Usuario"}`,
          "INFO"
        );
      }
    } catch (e) {
      console.error("Notification error", e);
    }

    res.json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ error: "Failed to create ticket" });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { subject, description, priority, status, assigneeId } = req.body;
  const user = (req as any).user;

  // FIX: Fetch ticket first to check ownership
  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  if (!user) return res.status(401).json({ error: "Unauthorized" });

  try {
    // FIX: Implement RBAC
    if (user.role === "CLIENT") {
      // 1. Check ownership
      if (ticket.creatorId !== user.id) {
        return res
          .status(403)
          .json({ error: "Forbidden: You can only update your own tickets" });
      }

      // 2. Prevent restricted field updates
      if (assigneeId || priority) {
        return res.status(403).json({
          error: "Forbidden: Clients cannot modify assignee or priority",
        });
      }

      // 3. Prevent sensitive status updates (only allow canceling/closing if needed, or block completely)
      // Assuming strict rule: "NO puede modificar... status sensible" implies blocking status changes that aren't controlled.
      // For now, let's allow them to 'RESOLVED' or 'CLOSED' if they want to close it?
      // User prompt says "NO puede modificar... status sensible".
      // I will STRICTLY block status changes for CLIENT to be safe and compliant with the "Security" focus.
      if (status && status !== ticket.status) {
        return res.status(403).json({
          error: "Forbidden: Clients cannot modify status",
        });
      }
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        subject,
        description,
        priority: user.role === "CLIENT" ? undefined : priority, // Double safety
        status: user.role === "CLIENT" ? undefined : status, // Double safety
        assigneeId: user.role === "CLIENT" ? undefined : assigneeId, // Double safety
      },
      include: {
        assignee: true,
        creator: true,
        messages: { include: { sender: true } },
      },
    });

    // Notify Update
    try {
      if (assigneeId && updatedTicket.assigneeId === assigneeId) {
        notify(
          assigneeId,
          "Ticket Asignado",
          `Te asignaron: ${updatedTicket.subject}`,
          "INFO"
        );
      }
      if (status && updatedTicket.status === status) {
        notify(
          updatedTicket.creatorId,
          "Estado Actualizado",
          `Tu ticket "${updatedTicket.subject}" ahora está: ${status}`,
          "SUCCESS"
        );
      }
    } catch (e) {
      console.error("Notification error", e);
    }

    res.json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ error: "Failed to update ticket" });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // First delete related attachments to avoid foreign key constraint errors
    await prisma.attachment.deleteMany({
      where: { ticketId: id },
    });

    // Then delete related messages
    await prisma.message.deleteMany({
      where: { ticketId: id },
    });

    // Finally delete the ticket
    await prisma.ticket.delete({
      where: { id },
    });
    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ error: "Failed to delete ticket" });
  }
};

export const addMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, senderId } = req.body;

  try {
    const message = await prisma.message.create({
      data: {
        content,
        ticketId: id,
        senderId,
      },
      include: { sender: true },
    });

    // Update ticket timestamp
    await prisma.ticket.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    res.json(message);
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ error: "Failed to add message" });
  }
};
