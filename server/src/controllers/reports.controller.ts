import { Request, Response } from "express";
import { prisma } from "../index";

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    // Date filters
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate as string);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate as string);
    }

    const whereClause =
      Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    // Get counts
    const [
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      totalUsers,
      totalClients,
      totalAgents,
      totalKBArticles,
    ] = await Promise.all([
      prisma.ticket.count({ where: whereClause }),
      prisma.ticket.count({ where: { ...whereClause, status: "OPEN" } }),
      prisma.ticket.count({ where: { ...whereClause, status: "IN_PROGRESS" } }),
      prisma.ticket.count({ where: { ...whereClause, status: "RESOLVED" } }),
      prisma.ticket.count({ where: { ...whereClause, status: "CLOSED" } }),
      prisma.user.count(),
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.user.count({ where: { role: "AGENT" } }),
      prisma.knowledgeBase.count({ where: { status: "PUBLISHED" } }),
    ]);

    res.json({
      tickets: {
        total: totalTickets,
        open: openTickets,
        inProgress: inProgressTickets,
        resolved: resolvedTickets,
        closed: closedTickets,
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

    const dateFilter: any = {};
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

    const dateFilter: any = {};
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

    const dateFilter: any = {};
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

// Get comprehensive dashboard summary
export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Run all queries in parallel
    const [
      totalTickets,
      openTickets,
      resolvedTickets,
      usersCount,
      clientsCount,
      recentTickets,
      timelineRaw,
    ] = await Promise.all([
      // Stats
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: "OPEN" } }),
      prisma.ticket.count({ where: { status: "RESOLVED" } }),
      prisma.user.count(),
      prisma.user.count({ where: { role: "CLIENT" } }),

      // Recent Tickets
      prisma.ticket.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { assignee: true, creator: true },
      }),

      // Timeline (Last 7 days)
      prisma.ticket.findMany({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
        select: {
          createdAt: true,
        },
      }),
    ]);

    // Process Timeline Data (Group by Day)
    const timeline: { name: string; date: string; tickets: number }[] = [];
    const days = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = d.toISOString().split("T")[0]; // YYYY-MM-DD
      const dayName = days[d.getDay()];
      timeline.push({ name: dayName, date: dateKey, tickets: 0 });
    }

    // Fill counts
    timelineRaw.forEach((t) => {
      const dateKey = new Date(t.createdAt).toISOString().split("T")[0];
      const entry = timeline.find((item) => item.date === dateKey);
      if (entry) {
        entry.tickets++;
      }
    });

    res.json({
      stats: {
        tickets: {
          total: totalTickets,
          open: openTickets,
          resolved: resolvedTickets,
        },
        users: {
          total: usersCount,
          clients: clientsCount,
        },
      },
      recentTickets,
      timeline,
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ error: "Failed to fetch dashboard summary" });
  }
};
