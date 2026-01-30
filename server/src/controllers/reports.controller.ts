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

    // Get counts
    // ⚡ Bolt Optimization: Use groupBy to reduce multiple COUNT queries to single queries
    const [
      ticketStats,
      userStats,
      totalUsers, // Keep specific count for safety/completeness
      totalKBArticles,
      criticalTickets, // Specific priority query
    ] = await Promise.all([
      // Group tickets by status (Replaces 4-5 separate COUNT queries)
      prisma.ticket.groupBy({
        by: ["status"],
        where: whereClause,
        _count: { id: true },
      }),
      // Group users by role (Replaces 2-3 separate COUNT queries)
      prisma.user.groupBy({
        by: ["role"],
        _count: { id: true },
      }),
      prisma.user.count(),
      prisma.knowledgeBase.count({ where: { status: "PUBLISHED" } }),
      // Critical tickets
      prisma.ticket.count({ where: { ...whereClause, priority: "CRITICAL" } }),
    ]);

    // Process Ticket Stats
    const ticketCounts = ticketStats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    // Calculate totals from grouped data
    // Note: totalTickets is sum of all status counts + potentially tickets without status?
    // Status is non-nullable enum, so sum is safe.
    // If whereClause is present, it applies to groupBy, so we get filtered counts.
    const totalTickets = Object.values(ticketCounts).reduce((a, b) => a + b, 0);
    const openTickets = ticketCounts["OPEN"] || 0;
    const inProgressTickets = ticketCounts["IN_PROGRESS"] || 0;
    const resolvedTickets = ticketCounts["RESOLVED"] || 0;
    const closedTickets = ticketCounts["CLOSED"] || 0;

    // Process User Stats
    const userCounts = userStats.reduce((acc, curr) => {
      acc[curr.role] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    const totalClients = userCounts["CLIENT"] || 0;
    const totalAgents = userCounts["AGENT"] || 0;

    res.json({
      tickets: {
        total: totalTickets,
        open: openTickets,
        inProgress: inProgressTickets,
        resolved: resolvedTickets,
        closed: closedTickets,
        critical: criticalTickets,
      },
      users: {
        total: totalUsers,
        clients: totalClients,
        agents: totalAgents,
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
