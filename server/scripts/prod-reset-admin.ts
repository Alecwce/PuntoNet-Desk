/**
 * Direct Production Database Admin Reset
 * This script connects directly to the Neon production database and:
 * 1. Resets the admin@puntonet.com 2FA to disabled
 * 2. Updates the password to a known temporary password
 *
 * Run this with: npx tsx scripts/prod-reset-admin.ts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Use the production DATABASE_URL from Railway env
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  const email = "admin@puntonet.com";
  const newPassword = "PuntoNet2024!Admin"; // New temporary password

  console.log(`🚀 Connecting to production database...`);
  console.log(`📧 Target: ${email}`);

  try {
    // Find the admin user
    const admin = await prisma.user.findUnique({
      where: { email },
    });

    if (!admin) {
      console.error(`❌ Admin user ${email} not found in database!`);
      process.exit(1);
    }

    console.log(`✅ Found admin: ${admin.id}`);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update admin: reset 2FA and change password
    await prisma.user.update({
      where: { id: admin.id },
      data: {
        password: hashedPassword,
        isTwoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    console.log(`
    ✅ PRODUCTION DATABASE UPDATED SUCCESSFULLY!
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Email:    ${email}
    Password: ${newPassword}
    2FA:      DISABLED
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    You can now login with these credentials.
    IMPORTANT: Change this password immediately after logging in!
      `);
  } catch (error) {
    console.error("❌ Error resetting admin:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
