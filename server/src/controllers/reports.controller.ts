import { Request, Response } from "express";
import { prisma } from "../index";
import { Prisma } from "@prisma/client";

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    // Date filters
    const dateFilter: Prisma.DateTimeFilter = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate as string);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate as string);
    }

    const whereClause =
      Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    // Get counts (Optimized with groupBy)
    const [ticketStats, userStats, totalKBArticles, criticalTickets] =
      await Promise.all([
        // Single query for all status counts
        prisma.ticket.groupBy({
          by: ["status"],
          where: whereClause,
          _count: { id: true },
        }),
        // Single query for all user role counts
        prisma.user.groupBy({
          by: ["role"],
          _count: { id: true },
        }),
        prisma.knowledgeBase.count({ where: { status: "PUBLISHED" } }),
        prisma.ticket.count({
          where: { ...whereClause, priority: "CRITICAL" },
        }),
      ]);

    // Process Ticket Stats
    const ticketCounts = {
      OPEN: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
      CLOSED: 0,
    };
    let totalTickets = 0;

    ticketStats.forEach((group) => {
      const count = group._count.id;
      if (group.status in ticketCounts) {
        ticketCounts[group.status as keyof typeof ticketCounts] = count;
      }
      totalTickets += count;
    });

    // Process User Stats
    const userCounts = {
      CLIENT: 0,
      AGENT: 0,
      ADMIN: 0,
    };
    let totalUsers = 0;

    userStats.forEach((group) => {
      const count = group._count.id;
      if (group.role in userCounts) {
        userCounts[group.role as keyof typeof userCounts] = count;
      }
      totalUsers += count;
    });

    res.json({
      tickets: {
        total: totalTickets,
        open: ticketCounts.OPEN,
        inProgress: ticketCounts.IN_PROGRESS,
        resolved: ticketCounts.RESOLVED,
        closed: ticketCounts.CLOSED,
        critical: criticalTickets,
      },
      users: {
        total: totalUsers,
        clients: userCounts.CLIENT,
        agents: userCounts.AGENT,
      },
      knowledgeBase: {
        published: totalKBArticles,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
};

// Get tickets by status (for charts)
export const getTicketsByStatus = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter: Prisma.DateTimeFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate as string);
    if (endDate) dateFilter.lte = new Date(endDate as string);

    const whereClause =
      Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    const ticketsByStatus = await prisma.ticket.groupBy({
      by: ["status"],
      where: whereClause,
      _count: {
        id: true,
      },
    });

    const formattedData = ticketsByStatus.map((item) => ({
      status: item.status,
      count: item._count.id,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching tickets by status:", error);
    res.status(500).json({ error: "Failed to fetch tickets by status" });
  }
};

// Get tickets by priority (for charts)
export const getTicketsByPriority = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter: Prisma.DateTimeFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate as string);
    if (endDate) dateFilter.lte = new Date(endDate as string);

    const whereClause =
      Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    const ticketsByPriority = await prisma.ticket.groupBy({
      by: ["priority"],
      where: whereClause,
      _count: {
        id: true,
      },
    });

    const formattedData = ticketsByPriority.map((item) => ({
      priority: item.priority,
      count: item._count.id,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching tickets by priority:", error);
    res.status(500).json({ error: "Failed to fetch tickets by priority" });
  }
};

// Get tickets timeline (tickets created per day/week/month)
export const getTicketsTimeline = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, groupBy = "day" } = req.query;

    const dateFilter: Prisma.DateTimeFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate as string);
    if (endDate) dateFilter.lte = new Date(endDate as string);

    const whereClause =
      Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group by date
    const grouped: { [key: string]: number } = {};

    tickets.forEach((ticket) => {
      const date = new Date(ticket.createdAt);
      let key: string;

      if (groupBy === "month") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      } else if (groupBy === "week") {
        const weekNumber = getWeekNumber(date);
        key = `${date.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
      } else {
        // day
        key = date.toISOString().split("T")[0];
      }

      grouped[key] = (grouped[key] || 0) + 1;
    });

    const formattedData = Object.entries(grouped).map(([date, count]) => ({
      date,
      count,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching tickets timeline:", error);
    res.status(500).json({ error: "Failed to fetch tickets timeline" });
  }
};

// Get top performing agents
export const getTopAgents = async (req: Request, res: Response) => {
  try {
    const { limit = "5" } = req.query;

    const agents = await prisma.user.findMany({
      where: {
        role: "AGENT",
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        ticketsAssigned: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    const agentsWithStats = agents.map((agent) => {
      const resolved = agent.ticketsAssigned.filter(
        (t) => t.status === "RESOLVED" || t.status === "CLOSED"
      ).length;
      const total = agent.ticketsAssigned.length;

      return {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        avatar: agent.avatar,
        totalTickets: total,
        resolvedTickets: resolved,
        resolutionRate: total > 0 ? ((resolved / total) * 100).toFixed(1) : "0",
      };
    });

    // Sort by resolution rate and total tickets
    agentsWithStats.sort((a, b) => {
      if (parseFloat(b.resolutionRate) !== parseFloat(a.resolutionRate)) {
        return parseFloat(b.resolutionRate) - parseFloat(a.resolutionRate);
      }
      return b.totalTickets - a.totalTickets;
    });

    res.json(agentsWithStats.slice(0, parseInt(limit as string)));
  } catch (error) {
    console.error("Error fetching top agents:", error);
    res.status(500).json({ error: "Failed to fetch top agents" });
  }
};

// Helper function to get week number
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
