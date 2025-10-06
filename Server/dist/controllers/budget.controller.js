"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBudgetSummary = exports.deleteBudget = exports.updateBudget = exports.createBudget = exports.getBudgets = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const budgetSchema = zod_1.z.object({
    budgetAmount: zod_1.z.number().positive(),
    startDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date(),
    categoryId: zod_1.z.number().int().positive(),
});
const updateBudgetSchema = budgetSchema.partial();
const getBudgets = async (req, res) => {
    try {
        const userId = req.user?.id;
        const budgets = await prisma_1.prisma.budget.findMany({
            where: { userId: Number(userId) },
            include: { category: true },
            orderBy: { startDate: "desc" },
        });
        console.log(budgets);
        res.json(budgets);
    }
    catch (error) {
        res.status(500).json({ message: "Internam Server Error" });
    }
};
exports.getBudgets = getBudgets;
const createBudget = async (req, res) => {
    console.log("Inside Controller Befoire try");
    try {
        console.log("first");
        const userId = req.user?.id;
        const parsed = budgetSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.issues });
        }
        const { budgetAmount, startDate, endDate, categoryId } = parsed.data;
        const budget = await prisma_1.prisma.budget.create({
            data: {
                budgetAmount,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                userId,
                categoryId,
            },
        });
        res.status(201).json(budget);
    }
    catch (error) {
        res.status(500).json({ messages: "Internal Server Error" });
    }
};
exports.createBudget = createBudget;
const updateBudget = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const parsed = updateBudgetSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.flatten() });
        }
        const existingBudget = await prisma_1.prisma.budget.findFirst({
            where: { id: Number(id), userId: Number(userId) },
        });
        if (!existingBudget) {
            return res.status(404).json({ message: "Budget Not Found or NOt owned" });
        }
        const updatedBudget = await prisma_1.prisma.budget.update({
            where: { id: existingBudget.id },
            data: {
                budgetAmount: parsed.data.budgetAmount,
                startDate: parsed.data.startDate,
                endDate: parsed.data.endDate,
            },
        });
        res.json(updatedBudget);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: error.message || "Failed to update budget" });
    }
};
exports.updateBudget = updateBudget;
const deleteBudget = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const existingBudget = await prisma_1.prisma.budget.findFirst({
            where: { id: Number(id), userId: Number(userId) },
        });
        if (!existingBudget) {
            return res
                .sendStatus(404)
                .json({ message: "Budget Not Found or not owned" });
        }
        await prisma_1.prisma.budget.delete({
            where: { id: existingBudget.id },
        });
        res.json({ message: "Budget deleted sucessfully" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: error.message || "Failed to deleted budget" });
    }
};
exports.deleteBudget = deleteBudget;
const getBudgetSummary = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        console.log(id);
        const budget = await prisma_1.prisma.budget.findFirst({
            where: { id: Number(id), userId: Number(userId) },
            include: { category: true },
        });
        if (!budget) {
            return res.status(404).json({ message: "Budget not FOund or Not owned" });
        }
        const expenses = await prisma_1.prisma.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId: Number(userId),
                categoryId: budget.categoryId,
                date: {
                    gte: budget.startDate,
                    lte: budget.endDate,
                },
            },
        });
        const totalSpent = expenses._sum?.amount ?? 0;
        const remaining = budget.budgetAmount - totalSpent;
        res.json({
            ...budget,
            totalSpent,
            remaining,
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: error.message || "Failed to get budget summary" });
    }
};
exports.getBudgetSummary = getBudgetSummary;
//# sourceMappingURL=budget.controller.js.map