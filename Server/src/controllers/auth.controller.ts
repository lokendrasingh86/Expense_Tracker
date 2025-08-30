import { RequestHandler } from "express";
import {prisma} from "../lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils";


export const signUp: RequestHandler = async (req, res) => { 
    const {fullName,password,email}=req.body();
    if(!fullName || !email || !password){
        return res.status(400).json({message:"Invalid Body"});
    }
    try {
        const existingUser = await prisma.user.findFirst({where:{OR : [{fullName},{email}]}
        });
        if(existingUser){
            return res.status(409).json({error:"User ALready Exists"})
        }
        const hashPassword = await bcrypt.hash(password,10);
        const newUser = await prisma.user.create({
            data:{
                fullName,
                email,
                password:hashPassword,
            }
        })
        return res.status(200).json({message:"User created Sucessfully "})
    } catch (error) {
        res.status(500).json({error:"INternal Server Error"})
    }

 }

 export const login:RequestHandler=async (req,res)=>{
    const {email,password}=req.body;
    try {
        const user = await prisma.user.findUnique({where:{email}});
        if(!user){
            return res.status(400).json({error:"Invalid FullName Or Password"})
        }
        const pass = await bcrypt.compare(password,user.password)
        if(!pass){
            return res.status(400).json({error:"INvalid Username or Password"})
        }

        generateToken(user.id,res)
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"})
    }
}


export const logout:RequestHandler=(req,res)=>{
    try {
        res.clearCookie("token",{
            httpOnly:true,
            sameSite:"lax",
        })
        res.status(200).json({message:"Logged Out Sucessfully"});
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"});
    }
}