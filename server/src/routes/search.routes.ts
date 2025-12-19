import { Router } from "express";
import { prisma } from "../index";
import { authenticate } from "../middleware/auth.middleware";
import { rateLimit } from "express-rate-limit";

const router = Router();

// Rate limiter: max 10 searches per minute per user
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: "Demasiadas búsquedas. Intenta de nuevo en 1 minuto." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/", authenticate, searchLimiter, async (req, res) => {
  const { q } = req.query;
  if (!q || typeof q !== "string" || q.length < 2) {
    return res.json({ tickets: [], users: [], articles: [] });
  }

  try {
    const [tickets, users, articles] = await prisma.$transaction([
      // Search tickets
      prisma.ticket.findMany({
        where: {
          OR: [
            { subject: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
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
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      // Search all users (not just clients)
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      }),
      // Search knowledge base
      prisma.knowledgeBase.findMany({
        where: {
          AND: [
            {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { content: { contains: q, mode: "insensitive" } },
              ],
            },
            { status: "PUBLISHED" },
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          content: true,
          views: true,
        },
      }),
    ]);

    res.json({ query: q, tickets, users, articles });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error performing search" });
  }
});

export default router;
