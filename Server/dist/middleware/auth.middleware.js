"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Not Authoirized,No token" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma_1.prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            return res.status(401).json({ message: "Not authorized , user not Found" });
        }
        ;
        req.user = { id: user.id, email: user.email };
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Not Authorized,Invalid Token" });
    }
};
exports.protectRoute = protectRoute;
//# sourceMappingURL=auth.middleware.js.map