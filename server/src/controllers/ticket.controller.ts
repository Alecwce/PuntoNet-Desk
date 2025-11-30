import { Request, Response } from "express";
import { prisma } from "../index";

export const getTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: { assignee: true, creator: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  const { subject, description, priority, creatorId } = req.body;
  try {
    const ticket = await prisma.ticket.create({
      data: {
        subject,
        description,
        priority,
        creatorId,
        status: "OPEN",
      },
      include: { assignee: true, creator: true },
    });
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
      include: { assignee: true, creator: true },
    });
    res.json(ticket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ error: "Failed to update ticket" });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // First delete related messages to avoid foreign key constraint errors
    await prisma.message.deleteMany({
      where: { ticketId: id },
    });

    await prisma.ticket.delete({
      where: { id },
    });
    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ error: "Failed to delete ticket" });
  }
};
