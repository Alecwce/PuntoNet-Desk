import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@puntonet.com";
  console.log(`Resetting 2FA for user: ${email}...`);

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error("User not found!");
      process.exit(1);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isTwoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    console.log("✅ 2FA has been disabled and secret cleared for admin.");
  } catch (error) {
    console.error("Error resetting 2FA:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
