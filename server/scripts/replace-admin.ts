import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const oldEmail = process.env.OLD_ADMIN_EMAIL || "admin@puntonet.com";
  const newEmail = process.env.NEW_ADMIN_EMAIL || "superadmin@puntonet.com";
  const password = process.env.ADMIN_TEMP_PASSWORD || "AdminTemporal2026!"; // Configurable temporary password

  console.log(`🚀 Starting Admin Replacement Operation...`);

  try {
    // 1. Check if old admin exists
    const oldAdmin = await prisma.user.findUnique({
      where: { email: oldEmail },
      include: { ticketsAssigned: true, ticketsCreated: true },
    });

    if (oldAdmin) {
      console.log(`Found old admin: ${oldAdmin.id}. Cleaning up...`);

      // Option A: Delete directly (Prisma/DB handles cascade or errors)
      // If there are constraints, we might fail. Let's try to delete.
      // If it fails, we will update it to a dummy email instead.
      try {
        await prisma.user.delete({
          where: { id: oldAdmin.id },
        });
        console.log("✅ Old admin deleted successfully.");
      } catch (e) {
        console.warn(
          "⚠️ Could not delete old admin (likely foreign key constraints). Archiving instead."
        );
        await prisma.user.update({
          where: { id: oldAdmin.id },
          data: {
            email: `archived_${Date.now()}_${oldEmail}`,
            isTwoFactorEnabled: false,
          },
        });
        console.log("✅ Old admin archived.");
      }
    } else {
      console.log("Old admin not found. Proceeding to create new one.");
    }

    // 2. Create New Admin (SuperAdmin)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.user.upsert({
      where: { email: newEmail },
      update: {
        password: hashedPassword,
        role: "ADMIN",
        isTwoFactorEnabled: false,
        twoFactorSecret: null,
        name: "Super Admin",
      },
      create: {
        email: newEmail,
        password: hashedPassword,
        name: "Super Admin",
        role: "ADMIN",
        isTwoFactorEnabled: false,
      },
    });

    console.log(`
    ✅ ACCOUNT CREATED SUCCESSFULLY!
    --------------------------------------------------
    EMAIL:    ${newEmail}
    PASSWORD: ${password}
    --------------------------------------------------
    PLEASE LOGIN AND CHANGE THIS PASSWORD IMMEDIATELY.
    `);
  } catch (error) {
    console.error("❌ Error replacing admin:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
