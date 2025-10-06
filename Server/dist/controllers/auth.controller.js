"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signUp = void 0;
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../lib/utils");
const signUp = async (req, res) => {
    const { fullName, password, email } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "Invalid Body" });
    }
    try {
        const existingUser = await prisma_1.prisma.user.findFirst({
            where: { OR: [{ fullName }, { email }] },
        });
        if (existingUser) {
            return res.status(409).json({ error: "User ALready Exists" });
        }
        const hashPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await prisma_1.prisma.user.create({
            data: {
                fullName,
                email,
                password: hashPassword,
            },
        });
        const defaultCategories = [
            { categoryName: "Food", categoryType: "expense" },
            { categoryName: "Transport", categoryType: "expense" },
            { categoryName: "Rent", categoryType: "expense" },
            { categoryName: "Salary", categoryType: "income" },
            { categoryName: "Entertainment", categoryType: "expense" },
        ];
        await prisma_1.prisma.category.createMany({
            data: defaultCategories.map((cat) => ({
                ...cat,
                userId: newUser.id,
            })),
        });
        return res.status(200).json({ message: "User created Sucessfully " });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.signUp = signUp;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: "Invalid FullName Or Password" });
        }
        const pass = await bcryptjs_1.default.compare(password, user.password);
        if (!pass) {
            return res.status(400).json({ error: "Invalid FullName or Password" });
        }
        (0, utils_1.generateToken)(user.id, res);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.login = login;
const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
        });
        res.status(200).json({ message: "Logged Out Sucessfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map