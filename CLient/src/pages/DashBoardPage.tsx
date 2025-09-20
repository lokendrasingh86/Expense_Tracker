import React, { useState, useEffect } from "react";
import type { FC } from "react";

// --- Charting Library Import ---
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

// --- Real Shadcn/UI Component Imports ---
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Target, MoreHorizontal } from "lucide-react";

// --- Axios Instance for API calls ---
// FIX: Using a direct relative path to resolve the import error.
import { axiosInstance } from "../lib/axios";


// --- Types to Match Your Backend ---
type Category = {
  id: number;
  categoryName: string;
};
type Transaction = {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: Category;
  categoryId: number;
};

type Summary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};
type SpendingByCategory = {
  categoryId: number;
  categoryName: string;
  total: number;
};
type MonthlySpendingTrend = {
  month: string;
  total: number;
};
type BudgetVsActual = {
  categoryId: number;
  categoryName?: string;
  budgeted: number;
  spent: number;
};
type Budget = {
  id: number;
  budgetAmount: number;
  startDate: string;
  endDate: string;
  category: Category;
  categoryId: number;
};
type BudgetSummary = {
  id: number;
  budgetAmount: number;
  startDate: string;
  endDate: string;
  category: Category;
  totalSpent: number;
  remaining: number;
};
// --- Helper for Pie Chart Colors ---
const COLORS = [
  "#0088FE", // blue
  "#00C49F", // green
  "#FFBB28", // yellow
  "#FF8042", // orange
  "#A020F0", // purple
  "#FF1493", // pink
];

// --- Main Dashboard Component ---
const DashboardPage: FC = () => {
  // --- STATE MANAGEMENT ---
  const [summary, setSummary] = useState<Summary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]); // New state for budgets
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null); // New state for a single budget summary
  const [spendingData, setSpendingData] = useState<SpendingByCategory[]>([]);
  const [trendsData, setTrendsData] = useState<MonthlySpendingTrend[]>([]);
  const [budgetData, setBudgetData] = useState<BudgetVsActual[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBudgetSummaryDialogOpen, setIsBudgetSummaryDialogOpen] = useState(false);

  const [newExpense, setNewExpense] = useState({
    categoryId: 0,
    amount: "",
    description: "",
  });
  const [newIncome, setNewIncome] = useState({
    categoryId: 0,
    amount: "",
    description: "",
  });
  const [newBudget, setNewBudget] = useState({
    categoryId: 0,
    budgetAmount: "",
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      .toISOString()
      .split("T")[0],
  });
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [activeTab, setActiveTab] = useState("spending");

  const fetchData = async () => {
    setError(null);
    try {
      const [
        summaryRes,
        transactionsRes,
        spendingRes,
        trendsRes,
        budgetRes,
        categoriesRes,
        budgetsRes, // ✅ Fetch all budgets
      ] = await Promise.all([
        axiosInstance.get("/transaction/summary"),
        axiosInstance.get("/transaction"),
        axiosInstance.get("/analytics/spending-by-category"),
        axiosInstance.get("/analytics/monthly-spending-trends"),
        axiosInstance.get("/analytics/budget-vs-actuals"),
        axiosInstance.get("/categories"),
        axiosInstance.get("/budgets"), // ✅ New fetch call
      ]);

      setSummary(summaryRes.data);
      setTransactions(transactionsRes.data);
      setBudgets(budgetsRes.data); // ✅ Set the budgets state

      const spendingJson: SpendingByCategory[] = spendingRes.data;
      const budgetJson: BudgetVsActual[] = budgetRes.data;

      const categoryNameMap = new Map<number, string>();
      spendingJson.forEach((item) =>
        categoryNameMap.set(item.categoryId, item.categoryName)
      );
      const enrichedBudgetData = budgetJson.map((budget) => ({
        ...budget,
        categoryName:
          categoryNameMap.get(budget.categoryId) ||
          `Category ${budget.categoryId}`,
      }));

      setSpendingData(spendingJson);
      setTrendsData(trendsRes.data);
      setBudgetData(enrichedBudgetData);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      setError(
        "Could not load dashboard data. Please make sure your backend server is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);

  const handleAddTransaction = async (
    type: "income" | "expense",
    data: { categoryId: number; amount: string; description: string }
  ) => {
    try {
      if (!data.categoryId || data.categoryId === 0) {
        // Use a modal or UI message instead of alert
        console.error("Please select a category");
        return;
      }

      const payload = {
        description: data.description,
        amount: parseFloat(data.amount),
        categoryId: Number(data.categoryId),
        type,
      };
      console.log("Payload before POST:", payload);

      await axiosInstance.post("/transaction", payload);

      setIsExpenseDialogOpen(false);
      setIsIncomeDialogOpen(false);
      setNewExpense({ categoryId: 0, amount: "", description: "" });
      setNewIncome({ categoryId: 0, amount: "", description: "" });

      setIsLoading(true);
      await fetchData();
    } catch (error) {
      console.error(`Failed to add ${type}:`, error);
    }
  };


  const handleUpdateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;
    try {
      const payload = {
        description: editingTransaction.description,
        amount: parseFloat(String(editingTransaction.amount)),
        categoryId: editingTransaction.categoryId,
      };
      await axiosInstance.put(`/transaction/${editingTransaction.id}`, payload);
      setIsEditDialogOpen(false);
      setEditingTransaction(null);
      setIsLoading(true);
      await fetchData();
    } catch (error) {
      console.error("Failed to update transaction:", error);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      await axiosInstance.delete(`/transaction/${id}`);
      setIsLoading(true);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const handleSetBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        categoryId: newBudget.categoryId,
        budgetAmount: parseFloat(newBudget.budgetAmount),
        startDate: new Date(newBudget.startDate),
        endDate: new Date(newBudget.endDate),
      };
      await axiosInstance.post("/budgets", payload);
      setIsBudgetDialogOpen(false);
      setNewBudget({
        categoryId: 0,
        budgetAmount: "",
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          .toISOString()
          .split("T")[0],
        endDate: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        )
          .toISOString()
          .split("T")[0],
      });
      setIsLoading(true);
      await fetchData();
    } catch (error) {
      console.error("Failed to set budget:", error);
    }
  };

  const handleUpdateBudget = async (id: number, updatedAmount: number) => {
    try {
      const payload = { budgetAmount: updatedAmount };
      await axiosInstance.put(`/budgets/${id}`, payload);
      await fetchData();
    } catch (error) {
      console.error("Failed to update budget:", error);
    }
  };

  const handleDeleteBudget = async (id: number) => {
    try {
      await axiosInstance.delete(`/budgets/${id}`);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete budget:", error);
    }
  };

  const handleGetBudgetSummary = async (id: number) => {
    try {
      const response = await axiosInstance.get(`/budgets/${id}/summary`);
      setBudgetSummary(response.data);
      setIsBudgetSummaryDialogOpen(true);
    } catch (error) {
      console.error("Failed to get budget summary:", error);
    }
  };

  const openEditDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Expense Tracker
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back! Here's your spending overview.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog
              open={isBudgetDialogOpen}
              onOpenChange={setIsBudgetDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Target className="mr-2 h-4 w-4" /> Set Budget
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set a New Budget</DialogTitle>
                  <DialogDescription>
                    Define a spending limit for a category over a period of
                    time.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSetBudget} className="space-y-4 pt-4">
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
                    <Label htmlFor="budget-amount">Budget Amount (₹)</Label>
                    <Input
                      id="budget-amount"
                      type="number"
                      value={newBudget.budgetAmount}
                      onChange={(e) =>
                        setNewBudget({
                          ...newBudget,
                          budgetAmount: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={newBudget.startDate}
                        onChange={(e) =>
                          setNewBudget({
                            ...newBudget,
                            startDate: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={newBudget.endDate}
                        onChange={(e) =>
                          setNewBudget({
                            ...newBudget,
                            endDate: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save Budget</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog
              open={isIncomeDialogOpen}
              onOpenChange={setIsIncomeDialogOpen}
            >
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
            <Dialog
              open={isExpenseDialogOpen}
              onOpenChange={setIsExpenseDialogOpen}
            >
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
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ₹{summary?.totalExpense.toLocaleString("en-IN")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ₹{summary?.balance.toLocaleString("en-IN")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ₹{summary?.totalIncome.toLocaleString("en-IN")}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="font-medium">{t.description}</div>
                      <div className="text-sm text-gray-500">
                        {t.category.categoryName}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(t.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono ${
                        t.type === "expense" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {t.type === "expense" ? "-" : "+"}₹{t.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(t)}>
                            Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                              </AlertDialogHeader>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this transaction.
                              </AlertDialogDescription>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteTransaction(t.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
            </DialogHeader>
            {editingTransaction && (
              <form
                onSubmit={handleUpdateTransaction}
                className="space-y-4 pt-4"
              >
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={editingTransaction.description}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-amount">Amount (₹)</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    value={editingTransaction.amount}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    defaultValue={String(editingTransaction.categoryId)}
                    onValueChange={(value) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        categoryId: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* --- Budget Management Section (NEW) --- */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets.length > 0 ? (
                  budgets.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <div className="font-medium">{b.category.categoryName}</div>
                      </TableCell>
                      <TableCell>₹{b.budgetAmount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUpdateBudget(b.id, b.budgetAmount + 100)}>Update (+₹100)</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteBudget(b.id)}>Delete</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleGetBudgetSummary(b.id)}>View Summary</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      No budgets set.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* --- Budget Summary Dialog (NEW) --- */}
        <Dialog open={isBudgetSummaryDialogOpen} onOpenChange={setIsBudgetSummaryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Budget Summary</DialogTitle>
              <DialogDescription>
                Overview of your budget for {budgetSummary?.category.categoryName}.
              </DialogDescription>
            </DialogHeader>
            {budgetSummary && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Budgeted Amount:</span>
                  <span>₹{budgetSummary.budgetAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Spent:</span>
                  <span>₹{budgetSummary.totalSpent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Remaining:</span>
                  <span>₹{budgetSummary.remaining.toFixed(2)}</span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>
              Visualize your financial data in different ways.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="spending">Spending</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="h-[400px] w-full pt-6">
              {activeTab === "spending" &&
                (spendingData.length > 0 ? (
                  <ResponsiveContainer key="spending-chart">
                    <PieChart>
                      <Tooltip
                        formatter={(value) =>
                          `₹${value.toLocaleString("en-IN")}`
                        }
                      />
                      <Pie
                        data={spendingData}
                        dataKey="total"
                        nameKey="categoryName"
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        label
                      >
                        {spendingData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    No spending data to display.
                  </div>
                ))}
                
              {activeTab === "trends" &&
                (trendsData.length > 0 ? (
                  <ResponsiveContainer key="trends-chart">
                    <LineChart data={trendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) =>
                          `₹${value.toLocaleString("en-IN")}`
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="Total Spent"
                        stroke="#111827"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    No trend data to display.
                  </div>
                ))}
              {activeTab === "budget" &&
                (budgetData.length > 0 ? (
                  <ResponsiveContainer key="budget-chart">
                    <BarChart data={budgetData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="categoryName" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) =>
                          `₹${value.toLocaleString("en-IN")}`
                        }
                      />
                      <Legend />
                      <Bar
                        dataKey="budgeted"
                        name="Budgeted"
                        fill="#6B7280"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="spent"
                        name="Spent"
                        fill="#111827"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    No budget data to display.
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
