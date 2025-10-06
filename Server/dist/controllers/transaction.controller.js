"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummary = exports.deleteTransaction = exports.updateTransaction = exports.createTransaction = exports.getTransactions = void 0;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const transactionSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
    description: zod_1.z.string().min(1),
    type: zod_1.z.enum(["income", "expense"]),
    categoryId: zod_1.z.number().int().positive(),
});
const getTransactions = async (req, res) => {
    try {
        console.log("Hello");
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const transactions = await prisma_1.prisma.transaction.findMany({
            where: { userId: Number(userId) },
            include: { category: true },
            orderBy: { date: "desc" },
        });
        console.log(transactions);
        res.json(transactions);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getTransactions = getTransactions;
const createTransaction = async (req, res) => {
    try {
        const userId = req.user?.id;
        console.log("User ID from request:", userId);
        const parsed = transactionSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.flatten() });
        }
        const { amount, description, type, categoryId } = parsed.data;
        const category = await prisma_1.prisma.category.findFirst({
            where: { id: categoryId, userId },
        });
        if (!category) {
            return res.status(400).json({ message: "Invalid categoryId" });
        }
        const transaction = await prisma_1.prisma.transaction.create({
            data: {
                amount,
                type,
                categoryId,
                userId: userId,
                description,
                date: new Date(),
            },
            include: { category: true },
        });
        res.status(201).json(transaction);
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};
exports.createTransaction = createTransaction;
const updateTransaction = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const parsed = transactionSchema.partial().safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.flatten() });
        }
        const transaction = await prisma_1.prisma.transaction.findFirst({
            where: { id: Number(id), userId },
        });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        const updated = await prisma_1.prisma.transaction.update({
            where: { id: transaction.id },
            data: {
                ...(parsed.data.description !== undefined && {
                    description: parsed.data.description,
                }),
                ...(parsed.data.amount !== undefined && {
                    amount: parsed.data.amount,
                }),
                ...(parsed.data.categoryId !== undefined && {
                    categoryId: parsed.data.categoryId,
                }),
                ...(parsed.data.type !== undefined && {
                    type: parsed.data.type,
                }),
            },
            include: { category: true },
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "Failed to update transaction",
        });
    }
};
exports.updateTransaction = updateTransaction;
const deleteTransaction = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const transaction = await prisma_1.prisma.transaction.findFirst({
            where: { id: Number(id), userId },
        });
        if (!transaction) {
            return res.status(400).json({ messsage: "Transaction Not Found" });
        }
        await prisma_1.prisma.transaction.delete({ where: { id: transaction.id } });
        res.json({ message: "Transaction deleted" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: error.message || "Failed to delete transaction" });
    }
};
exports.deleteTransaction = deleteTransaction;
const getSummary = async (req, res) => {
    try {
        const userId = req.user?.id;
        const summary = await prisma_1.prisma.transaction.groupBy({
            by: ["type"],
            _sum: { amount: true },
            where: { userId: Number(userId) },
        });
        const income = summary.find((s) => s.type === "income")?._sum?.amount ?? 0;
        const expense = summary.find((s) => s.type === "expense")?._sum?.amount ?? 0;
        res.json({
            totalIncome: income,
            totalExpense: expense,
            balance: income - expense,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message || "Failed to Fetch Summary",
        });
    }
};
exports.getSummary = getSummary;
//# sourceMappingURL=transaction.controller.js.map