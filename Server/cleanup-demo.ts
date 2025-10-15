import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupDemo() {
  try {
    // Delete demo user and all related data
    const demoUser = await prisma.user.findUnique({
      where: { email: "demo@example.com" },
    });

    if (demoUser) {
      // Delete all related data first
      await prisma.transaction.deleteMany({
        where: { userId: demoUser.id },
      });

      await prisma.budget.deleteMany({
        where: { userId: demoUser.id },
      });

      await prisma.category.deleteMany({
        where: { userId: demoUser.id },
      });

      // Finally delete the user
      await prisma.user.delete({
        where: { email: "demo@example.com" },
      });

      console.log("✅ Demo user removed successfully");
    } else {
      console.log("ℹ️ No demo user found");
    }

    console.log("🎉 Database is now clean for user registration");
  } catch (error) {
    console.error("Error removing demo user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDemo();
