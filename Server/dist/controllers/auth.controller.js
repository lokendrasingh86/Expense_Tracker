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
    console.log("Signup attempt:", { fullName, email, hasPassword: !!password });
    if (!fullName || !email || !password) {
        console.log("Missing required fields");
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const existingUser = await prisma_1.prisma.user.findFirst({
            where: { OR: [{ fullName }, { email }] },
        });
        if (existingUser) {
            console.log("User already exists:", existingUser.email);
            return res.status(409).json({ error: "User already exists" });
        }
        console.log("Creating new user...");
        const hashPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await prisma_1.prisma.user.create({
            data: {
                fullName,
                email,
                password: hashPassword,
            },
        });
        console.log("User created, adding default categories...");
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
        console.log("Signup successful for:", newUser.email);
        return res.status(200).json({ message: "User created successfully" });
    }
    catch (error) {
        console.error("Signup error:", error);
        res
            .status(500)
            .json({ error: "Internal Server Error", details: error.message });
    }
};
exports.signUp = signUp;
const login = async (req, res) => {
    const { email, password } = req.body;
    // Add validation
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        console.log("Login attempt for email:", email);
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.log("User not found for email:", email);
            return res.status(400).json({ error: "Invalid Email or Password" });
        }
        console.log("User found, comparing passwords...");
        const pass = await bcryptjs_1.default.compare(password, user.password);
        if (!pass) {
            console.log("Password comparison failed for email:", email);
            return res.status(400).json({ error: "Invalid Email or Password" });
        }
        console.log("Login successful for user:", user.email);
        (0, utils_1.generateToken)(user.id, res);
        res.status(200).json({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res
            .status(500)
            .json({ error: "Internal Server Error", details: error.message });
    }
};
exports.login = login;
const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        res.status(200).json({ message: "Logged Out Successfully" });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map