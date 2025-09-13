import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";


export const spendingByCategory:RequestHandler= async (req,res) =>{
    try {
        const userId = req.user?.id;
        const grouped = await prisma.transaction.groupBy({
            by:["categoryId"],
            where:{userId :Number(userId)},
            _sum:{amount:true}
        })
        const result = await Promise.all(
            grouped.map(async (item)=>{
                const category = await prisma.category.findUnique({
                    where:{id:item.categoryId}
                });
                return {
                    categoryId : item.categoryId,
                    categoryName:category?.categoryName,
                    categoryType:category?.categoryType,
                    total : item._sum.amount || 0,
                }

            })
        )
        res.json(result);
    } catch (error:any) {
        res.status(500).json({message:"Internal Server error"})
    }
}




export const monthlySpendingTrends:RequestHandler=async (req,res) =>{
    try {
        const userId = req.user?.id;
        const transactions = await prisma.transaction.findMany({
            where:{userId:Number(userId)},
            select:{amount:true , date:true},
            orderBy:{date:"asc"}
        })
        const trends : Record<string,number> = {};

        transactions.forEach((t)=>{
            const month = `${t.date.getFullYear()}-${String(t.date.getMonth()+1 ).padStart(2,"0")}`;
            trends[month] = (trends[month] || 0) + t.amount;
        });
        const result = Object.entries(trends).map(([month,total]) =>({
            month,
            total,
        }))
        res.json(result);
    } catch (error:any) {
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const budgetVsActual:RequestHandler= async (req,res)=>{
    try {
        const userId = req.user?.id;
        const budgets = await prisma.budget.findMany({
            where:{userId:Number(userId)}
        })

         const result = await Promise.all(
            budgets.map(async (budget) => {
                const spending = await prisma.transaction.aggregate({
                where: {
                    userId: Number(userId),
                    categoryId: budget.categoryId,
                    date: {
                    gte: budget.startDate,
                    lte: budget.endDate,
                    },
                },
                _sum: { amount: true },
            });

            return {
            budgetId: budget.id,
            categoryId: budget.categoryId,
            budgeted: budget.budgetAmount,
            spent: spending._sum.amount || 0,
            startDate: budget.startDate,
            endDate: budget.endDate,
            };
      })
    );
    res.json(result)
    } catch (error:any) {
        res.status(500).json({message:"Internal Server Error"});
    }
}