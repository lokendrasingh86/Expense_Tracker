import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios";

// Types
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
  name: string;
  value: number;
};

type MonthlySpendingTrend = {
  month: string;
  income: number;
  expense: number;
};

type BudgetVsActual = {
  category: string;
  budget: number;
  actual: number;
};

type Budget = {
  id: number;
  categoryId: number;
  budgetLimit: number;
  period: string;
  category: Category;
};

type BudgetSummary = {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
};

export const useDashboardData = () => {
  // State for data
  const [summary, setSummary] = useState<Summary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(
    null
  );
  const [spendingData, setSpendingData] = useState<SpendingByCategory[]>([]);
  const [trendsData, setTrendsData] = useState<MonthlySpendingTrend[]>([]);
  const [budgetData, setBudgetData] = useState<BudgetVsActual[]>([]);

  // Loading and error states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Form states
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    categoryId: 0,
  });

  const [newIncome, setNewIncome] = useState({
    description: "",
    amount: "",
    categoryId: 0,
  });

  const [newBudget, setNewBudget] = useState({
    categoryId: 0,
    budgetLimit: "",
    period: "monthly",
  });

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState("spending");

  // Fetch all data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch essential data first
      const [summaryRes, transactionsRes, categoriesRes] = await Promise.all([
        axiosInstance
          .get("/transaction/summary")
          .catch(() => ({
            data: { totalIncome: 0, totalExpense: 0, balance: 0 },
          })),
        axiosInstance.get("/transaction").catch(() => ({ data: [] })),
        axiosInstance.get("/categories").catch(() => ({ data: [] })),
      ]);

      // Fetch optional data
      const budgetsRes = await axiosInstance
        .get("/budgets")
        .catch(() => ({ data: [] }));
      const budgetSummaryRes = await axiosInstance
        .get("/analytics/budget-summary")
        .catch(() => ({
          data: { totalBudget: 0, totalSpent: 0, remainingBudget: 0 },
        }));
      const spendingRes = await axiosInstance
        .get("/analytics/spending-by-category")
        .catch(() => ({ data: [] }));
      const trendsRes = await axiosInstance
        .get("/analytics/monthly-spending-trends")
        .catch(() => ({ data: [] }));
      const budgetDataRes = await axiosInstance
        .get("/analytics/budget-vs-actuals")
        .catch(() => ({ data: [] }));

      const categoryNameMap = new Map<number, string>();
      categoriesRes.data.forEach((cat: Category) => {
        categoryNameMap.set(cat.id, cat.categoryName);
      });

      const mappedTransactions = transactionsRes.data.map((t: any) => ({
        ...t,
        category: {
          id: t.categoryId,
          categoryName: categoryNameMap.get(t.categoryId) || "Unknown",
        },
      }));

      // Transform spending by category data - only show expenses
      let transformedSpendingData = spendingRes.data
        .filter((item: any) => item.categoryType === "expense") // Only show expense categories
        .map((item: any) => ({
          name: item.categoryName || "Unknown",
          value: item.total || 0,
        }));

      // If no spending data from server, calculate from transactions
      if (
        transformedSpendingData.length === 0 &&
        mappedTransactions.length > 0
      ) {
        const categorySpending: Record<string, number> = {};

        mappedTransactions
          .filter((t: any) => t.type === "expense")
          .forEach((t: any) => {
            const categoryName = t.category.categoryName;
            categorySpending[categoryName] =
              (categorySpending[categoryName] || 0) + t.amount;
          });

        transformedSpendingData = Object.entries(categorySpending).map(
          ([name, value]) => ({
            name,
            value,
          })
        );
      }

      // Transform monthly trends data - calculate from transactions if server data is insufficient
      let transformedTrendsData = trendsRes.data.map((item: any) => ({
        month: item.month,
        income: 0,
        expense: item.total || 0,
      }));

      // If we have no trends data from server, calculate from transactions
      if (transformedTrendsData.length === 0 && mappedTransactions.length > 0) {
        const monthlyData: Record<string, { income: number; expense: number }> =
          {};

        mappedTransactions.forEach((t: any) => {
          const month = `${new Date(t.date).getFullYear()}-${String(
            new Date(t.date).getMonth() + 1
          ).padStart(2, "0")}`;
          if (!monthlyData[month]) {
            monthlyData[month] = { income: 0, expense: 0 };
          }

          if (t.type === "income") {
            monthlyData[month].income += t.amount;
          } else if (t.type === "expense") {
            monthlyData[month].expense += t.amount;
          }
        });

        transformedTrendsData = Object.entries(monthlyData).map(
          ([month, data]) => ({
            month,
            income: data.income,
            expense: data.expense,
          })
        );
      }

      // Transform budget vs actual data
      const transformedBudgetData = budgetDataRes.data.map((item: any) => ({
        category: categoryNameMap.get(item.categoryId) || "Unknown",
        budget: item.budgeted || 0,
        actual: item.spent || 0,
      }));

      setSummary(summaryRes.data);
      setTransactions(mappedTransactions);
      setCategories(categoriesRes.data);
      setBudgets(budgetsRes.data);
      setBudgetSummary(budgetSummaryRes.data);
      setSpendingData(transformedSpendingData);
      setTrendsData(transformedTrendsData);
      setBudgetData(transformedBudgetData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        `Failed to fetch dashboard data: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Add transaction
  const handleAddTransaction = async (
    type: "income" | "expense",
    data: any
  ) => {
    try {
      await axiosInstance.post("/transaction", {
        ...data,
        type,
        amount: parseFloat(data.amount),
      });

      // Reset form and close dialog
      if (type === "income") {
        setNewIncome({ description: "", amount: "", categoryId: 0 });
        setIsIncomeDialogOpen(false);
      } else {
        setNewExpense({ description: "", amount: "", categoryId: 0 });
        setIsExpenseDialogOpen(false);
      }

      // Refresh data
      fetchData();
    } catch (err) {
      console.error("Error adding transaction:", err);
      setError("Failed to add transaction");
    }
  };

  // Add budget
  const handleAddBudget = async (data: any) => {
    try {
      // Calculate start and end dates based on period
      const startDate = new Date();
      let endDate = new Date();

      switch (data.period) {
        case "weekly":
          endDate.setDate(startDate.getDate() + 7);
          break;
        case "monthly":
          endDate.setMonth(startDate.getMonth() + 1);
          break;
        case "yearly":
          endDate.setFullYear(startDate.getFullYear() + 1);
          break;
        default:
          endDate.setMonth(startDate.getMonth() + 1); // default to monthly
      }

      // Transform data to match server schema
      const budgetData = {
        budgetAmount: parseFloat(data.budgetLimit),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        categoryId: data.categoryId,
      };

      await axiosInstance.post("/budgets", budgetData);

      setNewBudget({ categoryId: 0, budgetLimit: "", period: "monthly" });
      setIsBudgetDialogOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error adding budget:", err);
      setError("Failed to add budget");
    }
  };

  // Update transaction
  const handleUpdateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;

    try {
      await axiosInstance.put(`/transaction/${editingTransaction.id}`, {
        description: editingTransaction.description,
        amount: editingTransaction.amount,
        categoryId: editingTransaction.categoryId,
      });

      setIsEditDialogOpen(false);
      setEditingTransaction(null);
      fetchData();
    } catch (err) {
      console.error("Error updating transaction:", err);
      setError("Failed to update transaction");
    }
  };

  // Delete transaction
  const handleDeleteTransaction = async (id: number) => {
    try {
      await axiosInstance.delete(`/transaction/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting transaction:", err);
      setError("Failed to delete transaction");
    }
  };

  // Open edit dialog
  const openEditDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return {
    // Data
    summary,
    transactions,
    categories,
    budgets,
    budgetSummary,
    spendingData,
    trendsData,
    budgetData,

    // States
    isLoading,
    error,

    // Dialog states
    isExpenseDialogOpen,
    setIsExpenseDialogOpen,
    isBudgetDialogOpen,
    setIsBudgetDialogOpen,
    isIncomeDialogOpen,
    setIsIncomeDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,

    // Form states
    newExpense,
    setNewExpense,
    newIncome,
    setNewIncome,
    newBudget,
    setNewBudget,
    editingTransaction,
    setEditingTransaction,
    activeTab,
    setActiveTab,

    // Actions
    handleAddTransaction,
    handleAddBudget,
    handleUpdateTransaction,
    handleDeleteTransaction,
    openEditDialog,
    fetchData,
  };
};
