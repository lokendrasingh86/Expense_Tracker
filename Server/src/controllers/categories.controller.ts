import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";

export const getCategories: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const categories = await prisma.category.findMany({
      where: {
           userId: Number(userId) 
      },
      orderBy: { id: "desc" },
    });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const createCategory: RequestHandler = async (req, res) => {
  const userId = req.user?.id;
  try {
    const { categoryName, categoryType } = req.body;
    if (!categoryName || !categoryType) {
      return res.status(400).json({ error: "Name Is Required" });
    }
    const category = await prisma.category.create({
      data: {
        categoryName,
        categoryType,
        userId: Number(userId),
      },
    });
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCategory: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { categoryName, categoryType } = req.body;
  const userId = req.user?.id;
  try {
    const updated = await prisma.category.updateMany({
      where: { id: Number(id), userId: Number(userId) },
      data: { categoryName, categoryType },
    });
    if (updated.count === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category updated" });
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCategory: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const deleted = await prisma.category.deleteMany({
      where: {
        id: Number(id),
        userId: Number(userId),
      },
    });
    if (deleted.count === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted" });
  } catch (error: any) {
    res.send(500).json({ message: "Internal Server Error" });
  }
};
