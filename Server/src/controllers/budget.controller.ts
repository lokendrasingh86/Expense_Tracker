import { RequestHandler } from "express";
import {z} from "zod";
import {prisma} from "../lib/prisma"

const budgetSchema = z.object({
    budgetAmount : z.number().positive(),
    startDate : z.string().datetime(),
    endDate : z.string().datetime(),
    categoryId : z.number().int().positive(),
})

    const updateBudgetSchema = budgetSchema.partial();
export const getBudgets:RequestHandler= async (req,res)=>{
    try {
        const userId = (req as any).userId;
        const budgets= await prisma.budget.findMany({
            where:{userId},
            include:{category:true},
            orderBy:{startDate:"desc"}
        })
        res.json(budgets)
    } catch (error) {
        res.status(500).json({message:"Internam Server Error"});
    }

}
export const createBudget:RequestHandler=async (req,res)=>{
    try {
        const userId = (req as any).userId;
        const parsed = budgetSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({errors :parsed.error.flatten()})
        }
        const {budgetAmount,startDate,endDate,categoryId}=parsed.data;
        const budget= await prisma.budget.create({
            data:{
                budgetAmount,
                startDate:new Date(startDate),
                endDate: new Date(endDate),
                userId,
                categoryId

            }
        })
        res.json(201).json(budget)
    } catch (error) {
        res.status(500).json({messages:"Internal Server Error"});
    }
}

export const updateBudget:RequestHandler= async (req,res)=>{
    try {
        const userId = (req as any).userId;
        const {id} = req.params;
        const parsed = updateBudgetSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({errors: parsed.error.flatten()});
        }
        const existingBudget = await prisma.budget.findFirst({
            where:{id:Number(id),userId},
        })
        if(! existingBudget){
            return res.status(404).json({mmessage:"Budget Not Found or NOt owned"})
        }
        const updatedBudget = await prisma.budget.update({
            where: { id: existingBudget.id },
            data: {
                ...parsed.data,
                ...(parsed.data.startDate && { startDate: new Date(parsed.data.startDate) }),
                ...(parsed.data.endDate && { endDate: new Date(parsed.data.endDate) }),
            },
        });
        res.json(updateBudget)

    } catch (error) {
        res.status(500).json({message:error.message || "Failed to update budget"})
    }
}
export const deleteBudget:RequestHandler= async (req,res)=>{
    try {
        const userId = (req as any).userId;
        const {id}= req.params;
        const existingBudget = await prisma.budget.findFirst({
            where:{ id: Number(id),userId},
        })
        if(!existingBudget){
            return res.sendStatus(404).json({message:"Budget Not Found or not owned"})
        }
        await prisma.budget.delete({
            where:{id:existingBudget.id},
        });
        res.json({message:"Budget deleted sucessfully"});
    } catch (error:any) {
        res.status(500).json({message: error.message || "Failed to deleted budget"})
    }
    
}
export const getBudgetSummary:RequestHandler= async (req,res)=>{
    try {
        const userId = (req as any).userId;
        const {id}= req.params;
        const budget = await prisma.budget.findFirst({
            where:{id:Number(id),userId},
            include:{category : true},
        })
        if(!budget){
            return res.status(404).json({message:"Budget not FOund or Not owned"})
        }
        const expenses = await prisma.transaction.aggregate({
            _sum:{amount:true},
            where:{
                userId,
                categoryId:budget.categoryId,
                date:{
                    gte:budget.startDate,
                    lte:budget.startDate
                }
            }
        })
        const totalSpent = expenses._sum?.amount ?? 0;
        const remaining = budget.budgetAmount - totalSpent;
        res.json({
            ...budget,
            totalSpent,
            remaining,
        });
    } catch (error) {
        res.status(500).json({message: error.message || "Failed to get budget summary"})
    }
     
}