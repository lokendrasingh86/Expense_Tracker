"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.budgetVsActual = exports.monthlySpendingTrends = exports.spendingByCategory = void 0;
const prisma_1 = require("../lib/prisma");
const spendingByCategory = async (req, res) => {
    try {
        const userId = req.user?.id;
        const grouped = await prisma_1.prisma.transaction.groupBy({
            by: ["categoryId"],
            where: { userId: Number(userId) },
            _sum: { amount: true }
        });
        const result = await Promise.all(grouped.map(async (item) => {
            const category = await prisma_1.prisma.category.findUnique({
                where: { id: item.categoryId }
            });
            return {
                categoryId: item.categoryId,
                categoryName: category?.categoryName,
                categoryType: category?.categoryType,
                total: item._sum.amount || 0,
            };
        }));
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server error" });
    }
};
exports.spendingByCategory = spendingByCategory;
const monthlySpendingTrends = async (req, res) => {
    try {
        const userId = req.user?.id;
        const transactions = await prisma_1.prisma.transaction.findMany({
            where: { userId: Number(userId) },
            select: { amount: true, date: true },
            orderBy: { date: "asc" }
        });
        const trends = {};
        transactions.forEach((t) => {
            const month = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, "0")}`;
            trends[month] = (trends[month] || 0) + t.amount;
        });
        const result = Object.entries(trends).map(([month, total]) => ({
            month,
            total,
        }));
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.monthlySpendingTrends = monthlySpendingTrends;
const budgetVsActual = async (req, res) => {
    try {
        const userId = req.user?.id;
        const budgets = await prisma_1.prisma.budget.findMany({
            where: { userId: Number(userId) }
        });
        const result = await Promise.all(budgets.map(async (budget) => {
            const spending = await prisma_1.prisma.transaction.aggregate({
                where: {
                    userId: Number(userId),
                    categoryId: budget.categoryId,
                    date: {
                        gte: budget.startDate,
                        lte: budget.endDate,
                    },
                },
                _sum: { amount: true },
            });
            return {
                budgetId: budget.id,
                categoryId: budget.categoryId,
                budgeted: budget.budgetAmount,
                spent: spending._sum.amount || 0,
                startDate: budget.startDate,
                endDate: budget.endDate,
            };
        }));
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.budgetVsActual = budgetVsActual;
//# sourceMappingURL=analytics.controller.js.map