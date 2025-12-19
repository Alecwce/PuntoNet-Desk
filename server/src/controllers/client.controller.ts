import { Request, Response } from "express";
import { prisma } from "../index";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

// Get all clients with pagination and search
export const getClients = async (req: Request, res: Response) => {
  const { search, page = "1", limit = "10" } = req.query;

  try {
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.UserWhereInput = {
      role: "CLIENT", // Only fetch CLIENT role users
    };

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: "insensitive" as const } },
        { email: { contains: String(search), mode: "insensitive" as const } },
      ];
    }

    const [clients, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              ticketsCreated: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      data: clients,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
};

// Get single client by ID
export const getClientById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const client = await prisma.user.findUnique({
      where: { id, role: "CLIENT" },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        ticketsCreated: {
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            subject: true,
            status: true,
            priority: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            ticketsCreated: true,
          },
        },
      },
    });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ error: "Failed to fetch client" });
  }
};

// Create new client
export const createClient = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  // Validation
  if (!email || !name || !password) {
    return res
      .status(400)
      .json({ error: "Email, name and password are required" });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Password validation (minimum 6 characters)
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate avatar
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random&color=fff`;

    // Create client
    const client = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "CLIENT",
        avatar,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json(client);
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ error: "Failed to create client" });
  }
};

// Update client
export const updateClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, name, password } = req.body;

  // Validation
  if (!email && !name && !password) {
    return res.status(400).json({ error: "At least one field is required" });
  }

  // Email validation if provided
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
  }

  // Password validation if provided
  if (password && password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  try {
    // Check if client exists
    const existingClient = await prisma.user.findUnique({
      where: { id, role: "CLIENT" },
    });

    if (!existingClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Check if email already exists (if changing email)
    if (email && email !== existingClient.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    // Prepare update data
    const updateData: Prisma.UserUpdateInput = {};
    if (email) updateData.email = email;
    if (name) {
      updateData.name = name;
      updateData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=random&color=fff`;
    }
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update client
    const client = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(client);
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ error: "Failed to update client" });
  }
};

// Delete client
export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if client exists
    const existingClient = await prisma.user.findUnique({
      where: { id, role: "CLIENT" },
    });

    if (!existingClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Delete related data first (cascade delete)
    // 1. Delete messages
    await prisma.message.deleteMany({
      where: { senderId: id },
    });

    // 2. Delete attachments
    await prisma.attachment.deleteMany({
      where: { uploaderId: id },
    });

    // 3. Update or delete tickets (set creator to null or delete)
    // Option 1: Set creatorId to null (keep tickets)
    await prisma.ticket.deleteMany({
      where: { creatorId: id },
    });

    // 4. Delete the client
    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ error: "Failed to delete client" });
  }
};
