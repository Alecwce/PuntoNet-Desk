import { Request, Response } from "express";
import { prisma } from "../index";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role, avatar } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "CLIENT",
        avatar: avatar || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, role, avatar, password } = req.body;

  try {
    const updateData: Prisma.UserUpdateInput = { name, email, role, avatar };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
    });
    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, avatar, password } = req.body;

  try {
    const updateData: Prisma.UserUpdateInput = { name, avatar };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
    });
    res.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Backend received delete request for user:", id); // Debug log
  try {
    // 1. Delete all messages sent by the user
    await prisma.message.deleteMany({
      where: { senderId: id },
    });

    // 2. Unassign tickets assigned to the user
    await prisma.ticket.updateMany({
      where: { assigneeId: id },
      data: { assigneeId: null },
    });

    // 3. Find tickets created by the user
    const userTickets = await prisma.ticket.findMany({
      where: { creatorId: id },
      select: { id: true },
    });

    const ticketIds = userTickets.map((t) => t.id);

    // 4. Delete messages in those tickets (to avoid constraint violation when deleting tickets)
    if (ticketIds.length > 0) {
      await prisma.message.deleteMany({
        where: { ticketId: { in: ticketIds } },
      });

      // 5. Delete tickets created by the user
      await prisma.ticket.deleteMany({
        where: { id: { in: ticketIds } },
      });
    }

    // 6. Finally, delete the user
    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
