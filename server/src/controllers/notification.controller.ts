import { Request, Response } from "express";
import { prisma } from "../index";

// === HELPER FUNCTION ===
// Use this to send notifications from other controllers
export const notify = async (
  recipientId: string,
  title: string,
  message: string,
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR" = "INFO",
  link?: string
) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        recipientId,
        title,
        message,
        type,
        link,
      },
    });
    console.log(`🔔 Notification sent to ${recipientId}: ${title}`);
    return notification;
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    return null;
  }
};

export const notifyMany = async (
  recipientIds: string[],
  title: string,
  message: string,
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR" = "INFO",
  link?: string
) => {
  if (recipientIds.length === 0) return;

  try {
    const notifications = recipientIds.map((id) => ({
      recipientId: id,
      title,
      message,
      type,
      link,
    }));

    const result = await prisma.notification.createMany({
      data: notifications,
    });
    console.log(
      `🔔 Batch notifications sent to ${result.count} recipients: ${title}`
    );
    return result;
  } catch (error) {
    console.error("❌ Error sending batch notifications:", error);
    return null;
  }
};

// === API CONTROLLERS ===

export const getNotifications = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const notifications = await prisma.notification.findMany({
      where: { recipientId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 20, // Limit to last 20
    });

    // Count unread
    const unreadCount = await prisma.notification.count({
      where: { recipientId: req.user.id, isRead: false },
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      error: "Failed to fetch notifications",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    // Verify ownership
    const notification = await prisma.notification.findUnique({
      where: { id },
    });
    if (!notification || notification.recipientId !== req.user.id) {
      return res.status(404).json({ error: "Notification not found" });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update notification" });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    await prisma.notification.updateMany({
      where: { recipientId: req.user.id, isRead: false },
      data: { isRead: true },
    });
    res.json({ message: "All marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark all as read" });
  }
};
