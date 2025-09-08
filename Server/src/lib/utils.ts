import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (userId: string | number, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV != "development",
  });
};
