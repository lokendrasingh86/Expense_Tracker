"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const prisma_1 = require("../lib/prisma");
const getCategories = async (req, res) => {
    try {
        const userId = req.user?.id;
        const categories = await prisma_1.prisma.category.findMany({
            where: {
                userId: Number(userId)
            },
            orderBy: { id: "desc" },
        });
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server Error" });
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    const userId = req.user?.id;
    try {
        const { categoryName, categoryType } = req.body;
        if (!categoryName || !categoryType) {
            return res.status(400).json({ error: "Name Is Required" });
        }
        const category = await prisma_1.prisma.category.create({
            data: {
                categoryName,
                categoryType,
                userId: Number(userId),
            },
        });
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { categoryName, categoryType } = req.body;
    const userId = req.user?.id;
    try {
        const updated = await prisma_1.prisma.category.updateMany({
            where: { id: Number(id), userId: Number(userId) },
            data: { categoryName, categoryType },
        });
        if (updated.count === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category updated" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const deleted = await prisma_1.prisma.category.deleteMany({
            where: {
                id: Number(id),
                userId: Number(userId),
            },
        });
        if (deleted.count === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted" });
    }
    catch (error) {
        res.send(500).json({ message: "Internal Server Error" });
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=categories.controller.js.map