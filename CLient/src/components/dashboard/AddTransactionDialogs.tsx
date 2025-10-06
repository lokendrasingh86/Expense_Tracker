import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Target } from "lucide-react";

type Category = {
  id: number;
  categoryName: string;
};

interface AddTransactionDialogsProps {
  // Income Dialog Props
  isIncomeDialogOpen: boolean;
  setIsIncomeDialogOpen: (open: boolean) => void;
  newIncome: { description: string; amount: string; categoryId: number };
  setNewIncome: (income: any) => void;

  // Expense Dialog Props
  isExpenseDialogOpen: boolean;
  setIsExpenseDialogOpen: (open: boolean) => void;
  newExpense: { description: string; amount: string; categoryId: number };
  setNewExpense: (expense: any) => void;

  // Budget Dialog Props
  isBudgetDialogOpen: boolean;
  setIsBudgetDialogOpen: (open: boolean) => void;
  newBudget: { categoryId: number; budgetLimit: string; period: string };
  setNewBudget: (budget: any) => void;

  // Common Props
  categories: Category[];
  handleAddTransaction: (type: "income" | "expense", data: any) => void;
  handleAddBudget: (data: any) => void;
}

export const AddTransactionDialogs: React.FC<AddTransactionDialogsProps> = ({
  isIncomeDialogOpen,
  setIsIncomeDialogOpen,
  newIncome,
  setNewIncome,
  isExpenseDialogOpen,
  setIsExpenseDialogOpen,
  newExpense,
  setNewExpense,
  isBudgetDialogOpen,
  setIsBudgetDialogOpen,
  newBudget,
  setNewBudget,
  categories,
  handleAddTransaction,
  handleAddBudget,
}) => {
  return (
    <div className="flex gap-2">
      {/* Add Income Dialog */}
      <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Income
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Income</DialogTitle>
            <DialogDescription>
              Enter the details for your new income source.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTransaction("income", newIncome);
            }}
            className="space-y-4 pt-4"
          >
            <div>
              <Label htmlFor="income-description">Description</Label>
              <Input
                id="income-description"
                value={newIncome.description}
                onChange={(e) =>
                  setNewIncome({
                    ...newIncome,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="income-amount">Amount (₹)</Label>
              <Input
                id="income-amount"
                type="number"
                value={newIncome.amount}
                onChange={(e) =>
                  setNewIncome({ ...newIncome, amount: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="income-category">Category</Label>
              <Select
                onValueChange={(value) =>
                  setNewIncome({
                    ...newIncome,
                    categoryId: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an income category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit">Save Income</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Expense Dialog */}
      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Expense</DialogTitle>
            <DialogDescription>
              Enter the details for your new transaction.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTransaction("expense", newExpense);
            }}
            className="space-y-4 pt-4"
          >
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({
                    ...newExpense,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) =>
                  setNewExpense({
                    ...newExpense,
                    categoryId: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit">Save Expense</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Budget Dialog */}
      <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Target className="mr-2 h-4 w-4" /> Set Budget
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Budget for Category</DialogTitle>
            <DialogDescription>
              Set a spending limit for a specific category.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddBudget(newBudget);
            }}
            className="space-y-4 pt-4"
          >
            <div>
              <Label htmlFor="budget-category">Category</Label>
              <Select
                onValueChange={(value) =>
                  setNewBudget({
                    ...newBudget,
                    categoryId: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="budget-limit">Budget Limit (₹)</Label>
              <Input
                id="budget-limit"
                type="number"
                value={newBudget.budgetLimit}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, budgetLimit: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="budget-period">Period</Label>
              <Select
                onValueChange={(value) =>
                  setNewBudget({ ...newBudget, period: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit">Set Budget</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
