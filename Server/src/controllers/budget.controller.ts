import { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const budgetSchema = z.object({
  budgetAmount: z.number().positive(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  categoryId: z.number().int().positive(),
});

const updateBudgetSchema = budgetSchema.partial();
export const getBudgets: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const budgets = await prisma.budget.findMany({
      where: { userId: Number(userId) },
      include: { category: true },
      orderBy: { startDate: "desc" },
    });
    console.log(budgets);
    res.json(budgets);
  } catch (error: any) {
    res.status(500).json({ message: "Internam Server Error" });
  }
};
export const createBudget: RequestHandler = async (req, res) => {
  console.log("Inside Controller Befoire try");
  try {
    console.log("first");
    const userId = req.user?.id!;
    const parsed = budgetSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.issues });
    }
    const { budgetAmount, startDate, endDate, categoryId } = parsed.data;
    const budget = await prisma.budget.create({
      data: {
        budgetAmount,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId,
        categoryId,
      },
    });
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ messages: "Internal Server Error" });
  }
};

export const updateBudget: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const parsed = updateBudgetSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() });
    }
    const existingBudget = await prisma.budget.findFirst({
      where: { id: Number(id), userId: Number(userId) },
    });
    if (!existingBudget) {
      return res.status(404).json({ message: "Budget Not Found or NOt owned" });
    }
    const updatedBudget = await prisma.budget.update({
      where: { id: existingBudget.id },
      data: {
        budgetAmount: parsed.data.budgetAmount!,
        startDate: parsed.data.startDate!,
        endDate: parsed.data.endDate!,
      },
    });
    res.json(updatedBudget);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Failed to update budget" });
  }
};
export const deleteBudget: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const existingBudget = await prisma.budget.findFirst({
      where: { id: Number(id), userId: Number(userId) },
    });
    if (!existingBudget) {
      return res
        .sendStatus(404)
        .json({ message: "Budget Not Found or not owned" });
    }
    await prisma.budget.delete({
      where: { id: existingBudget.id },
    });
    res.json({ message: "Budget deleted sucessfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Failed to deleted budget" });
  }
};
export const getBudgetSummary: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    console.log(id);
    const budget = await prisma.budget.findFirst({
      where: { id: Number(id), userId: Number(userId) },
      include: { category: true },
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not FOund or Not owned" });
    }
    const expenses = await prisma.transaction.aggregate({
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
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: error.message || "Failed to get budget summary" });
  }
};
