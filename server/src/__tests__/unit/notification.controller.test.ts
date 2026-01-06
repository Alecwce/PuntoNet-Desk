import { describe, it, expect, vi, beforeEach } from "vitest";
import { notifyMany } from "../../controllers/notification.controller";
import { prisma } from "../../index";

// Mock Prisma
vi.mock("../../index", () => ({
  prisma: {
    notification: {
      createMany: vi.fn(),
    },
  },
}));

describe("Notification Controller - notifyMany", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create notifications for multiple recipients", async () => {
    const recipients = ["user1", "user2", "user3"];
    const title = "Test Title";
    const message = "Test Message";

    // Mock successful creation
    (prisma.notification.createMany as any).mockResolvedValue({ count: 3 });

    const result = await notifyMany(recipients, title, message);

    expect(prisma.notification.createMany).toHaveBeenCalledTimes(1);
    expect(prisma.notification.createMany).toHaveBeenCalledWith({
      data: [
        { recipientId: "user1", title, message, type: "INFO", link: undefined },
        { recipientId: "user2", title, message, type: "INFO", link: undefined },
        { recipientId: "user3", title, message, type: "INFO", link: undefined },
      ],
    });
    expect(result).toEqual({ count: 3 });
  });

  it("should return count 0 if no recipients provided", async () => {
    const result = await notifyMany([], "Title", "Message");
    expect(prisma.notification.createMany).not.toHaveBeenCalled();
    expect(result).toEqual({ count: 0 });
  });

  it("should handle errors gracefully", async () => {
    const recipients = ["user1"];

    // Mock error
    (prisma.notification.createMany as any).mockRejectedValue(new Error("DB Error"));

    // Silence console.error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await notifyMany(recipients, "Title", "Message");

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
