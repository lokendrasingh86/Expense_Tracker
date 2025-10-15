import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Just seed some basic data if needed, but no demo users
  // Users will register their own accounts

  console.log("✅ Seed completed");
  console.log("� Ready for user registration");
  console.log("   Users can now register with any email/password");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
