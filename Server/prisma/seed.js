"use strict";
// import { PrismaClient } from "@prisma/client";
Object.defineProperty(exports, "__esModule", { value: true });
// const prisma = new PrismaClient();
// async function main() {
//   // 1. Ensure a default user exists
//   const user = await prisma.user.upsert({
//     where: { email: "demo@example.com" },
//     update: {},
//     create: {
//       email: "demo@example.com",
//       password: "hashedpassword", // put a real hash if using auth
//       fullName: "Demo User",
//     },
//   });
//   // 2. Default categories
//   const defaultCategories = [
//     { categoryName: "Food", categoryType: "expense" },
//     { categoryName: "Transport", categoryType: "expense" },
//     { categoryName: "Rent", categoryType: "expense" },
//     { categoryName: "Salary", categoryType: "income" },
//     { categoryName: "Entertainment", categoryType: "expense" },
//   ];
//   // 3. Attach categories to that user
//   for (const cat of defaultCategories) {
//     await prisma.category.upsert({
//       where: {
//         categoryName_userId: {
//           categoryName: cat.categoryName,
//           userId: user.id,
//         },
//       },
//       update: {},
//       create: {
//         categoryName: cat.categoryName,
//         categoryType: cat.categoryType,
//         userId: user.id,
//       },
//     });
//   }
//   console.log("✅ Seed completed");
// }
// main()
//   .then(async () => await prisma.$disconnect())
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
//# sourceMappingURL=seed.js.map