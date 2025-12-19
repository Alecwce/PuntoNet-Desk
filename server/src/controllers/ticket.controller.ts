import { Request, Response } from "express";
import { prisma } from "../index";
import { Prisma } from "@prisma/client";
import { notify } from "./notification.controller";

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
      staff.forEach((member) => {
        if (member.id !== user.id) {
          notify(
            member.id,
            "Nuevo Ticket",
            `Ticket #${ticket.subject} creado por ${user.name || "Usuario"}`,
            "INFO"
          );
        }
      });
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

  try {
    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        subject,
        description,
        priority,
        status,
        assigneeId,
      },
      include: {
        assignee: true,
        creator: true,
        messages: { include: { sender: true } },
      },
    });

    // Notify Update
    try {
      if (assigneeId && ticket.assigneeId === assigneeId) {
        notify(
          assigneeId,
          "Ticket Asignado",
          `Te asignaron: ${ticket.subject}`,
          "INFO"
        );
      }
      if (status && ticket.status === status) {
        notify(
          ticket.creatorId,
          "Estado Actualizado",
          `Tu ticket "${ticket.subject}" ahora está: ${status}`,
          "SUCCESS"
        );
      }
    } catch (e) {
      console.error("Notification error", e);
    }

    res.json(ticket);
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
