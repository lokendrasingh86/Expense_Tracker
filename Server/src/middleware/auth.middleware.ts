import {Request,Response,NextFunction} from "express";

import jwt from "jsonwebtoken";
import {prisma} from "../lib/prisma";

interface JwtPayload{
    userId : number;
}

declare global {
    namespace Express{
        interface Request {
            user?:{id:number,email:string};
        }
    }
}

export const protectRoute = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({message : "Not Authorized, No token"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET!) as JwtPayload;

        const user = await prisma.user.findUnique({where:{id:decoded.userId}});
        if(!user){
            return res.status(401).json({message:"Not authorized, user not found"});
        };
        req.user={id:user.id,email:user.email};
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({message:"Not Authorized, Invalid Token"});
    }
}