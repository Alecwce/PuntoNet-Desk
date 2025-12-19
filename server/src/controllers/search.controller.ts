import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/**
 * Global search across tickets, users, and knowledge base
 * Rate limited to 10 searches per minute
 */
export const globalSearch = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    // Minimum search length validation
    if (!q || typeof q !== "string" || q.length < 2) {
      return res.json({ tickets: [], users: [], articles: [] });
    }

    const searchTerm = q.trim();

    // Execute searches in parallel with result limits
    const [tickets, users, articles] = await Promise.all([
      // Search tickets
      prisma.ticket.findMany({
        where: {
          OR: [
            { subject: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        take: 5, // Limit results
        select: {
          id: true,
          subject: true,
          description: true,
          status: true,
          priority: true,
          createdAt: true,
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      // Search users
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { email: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
        },
      }),

      // Search knowledge base articles
      prisma.knowledgeBase.findMany({
        where: {
          AND: [
            {
              OR: [
                { title: { contains: searchTerm, mode: "insensitive" } },
                { content: { contains: searchTerm, mode: "insensitive" } },
              ],
            },
            { status: "PUBLISHED" }, // Only show published articles
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          content: true,
          views: true,
          createdAt: true,
        },
      }),
    ]);

    res.json({
      query: searchTerm,
      tickets,
      users,
      articles,
    });
  } catch (error) {
    console.error("Global search error:", error);
    res.status(500).json({ error: "Error performing search" });
  }
};
