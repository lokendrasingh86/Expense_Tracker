import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';


// --- Types based on your backend API ---

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
  budgetId: number;
  categoryId: number;
  categoryName?: string;
  budgeted: number;
  spent: number;
};

// --- Mock Transaction Type (as no backend endpoint was provided for this) ---
type Transaction = {
    id: number;
    date: string;
    description: string;
    category: string;
    amount: number;
};


// --- API & MOCK DATA SETUP ---
const API_BASE_URL = 'http://localhost:8000';

const MOCK_SPENDING_DATA: SpendingByCategory[] = [
    { categoryId: 1, categoryName: 'Food', total: 450.75 },
    { categoryId: 2, categoryName: 'Transport', total: 120.50 },
    { categoryId: 3, categoryName: 'Shopping', total: 320.00 },
];
const MOCK_TRENDS_DATA: MonthlySpendingTrend[] = [ { month: '2023-08', total: 1150 }, { month: '2023-09', total: 1345 }, { month: '2023-10', total: 891.50 }];
const MOCK_BUDGET_DATA: BudgetVsActual[] = [
    { budgetId: 1, categoryId: 1, budgeted: 500, spent: 450.75 },
    { budgetId: 2, categoryId: 2, budgeted: 150, spent: 120.50 },
    { budgetId: 3, categoryId: 3, budgeted: 300, spent: 320.00 },
];
const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 1, date: '2023-10-12', description: 'Groceries', category: 'Food', amount: 75.20 },
    { id: 2, date: '2023-10-11', description: 'Gasoline', category: 'Transport', amount: 40.00 },
    { id: 3, date: '2023-10-10', description: 'New Shirt', category: 'Shopping', amount: 55.00 },
    { id: 4, date: '2023-10-09', description: 'Lunch with friends', category: 'Food', amount: 35.50 },
];


// --- Helper: Generate random colors for the pie chart ---
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1962'];


// --- Main Dashboard Component ---

const DashboardPage: FC = () => {
  const [spendingData, setSpendingData] = useState<SpendingByCategory[]>([]);
  const [trendsData, setTrendsData] = useState<MonthlySpendingTrend[]>([]);
  const [budgetData, setBudgetData] = useState<BudgetVsActual[]>([]);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]); // State for transactions
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState<boolean>(false);

  useEffect(() => {
    const loadMockData = () => {
        console.warn("API fetch failed. Falling back to mock data for UI preview.");
        setIsMockMode(true);
        const categoryNameMap = new Map<number, string>();
        MOCK_SPENDING_DATA.forEach(item => {
            categoryNameMap.set(item.categoryId, item.categoryName);
        });
        const enrichedBudgetData = MOCK_BUDGET_DATA.map(budget => ({
            ...budget,
            categoryName: categoryNameMap.get(budget.categoryId) || `Category ${budget.categoryId}`
        }));
        setSpendingData(MOCK_SPENDING_DATA);
        setTrendsData(MOCK_TRENDS_DATA);
        setBudgetData(enrichedBudgetData);
        setTransactions(MOCK_TRANSACTIONS);
    };

    const fetchData = async () => {
      // ... (existing fetchData logic remains the same, but we'll add transactions)
      // For now, we just load mock transactions since there's no endpoint
      setTransactions(MOCK_TRANSACTIONS); 

      // The rest of the fetch logic
      setIsLoading(true);
      setError(null);
      try {
        const responses = await Promise.all([
            fetch(`${API_BASE_URL}/api/spending-by-category`),
            fetch(`${API_BASE_URL}/api/monthly-spending-trends`),
            fetch(`${API_BASE_URL}/api/budget-vs-actuals`)
        ]);

        for (const res of responses) {
            if (!res.ok) throw new Error(`Server responded with an error: ${res.status}`);
        }
        
        const [spendingJson, trendsJson, budgetJson] = await Promise.all(responses.map(res => res.json()));

        if (!Array.isArray(spendingJson) || !Array.isArray(trendsJson) || !Array.isArray(budgetJson)) {
            throw new Error("API response is not in the expected array format.");
        }

        const categoryNameMap = new Map<number, string>();
        spendingJson.forEach((item: SpendingByCategory) => { categoryNameMap.set(item.categoryId, item.categoryName); });
        const enrichedBudgetData = budgetJson.map((budget: BudgetVsActual) => ({ ...budget, categoryName: categoryNameMap.get(budget.categoryId) || `Category ${budget.categoryId}` }));

        setSpendingData(spendingJson);
        setTrendsData(trendsJson);
        setBudgetData(enrichedBudgetData);

      } catch (err: any) {
        console.error("Dashboard Fetch Error:", err);
        setError('Could not connect to the API server. Please ensure your backend has CORS enabled and is running.');
        loadMockData();
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-lg font-medium">Loading dashboard...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back! Here's your financial summary.</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>
                    Enter the details of your transaction here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Input id="description" placeholder="e.g., Coffee" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">Amount ($)</Label>
                    <Input id="amount" type="number" placeholder="15.00" className="col-span-3" />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">Category</Label>
                     <Select>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="food">Food</SelectItem>
                            <SelectItem value="transport">Transport</SelectItem>
                            <SelectItem value="shopping">Shopping</SelectItem>
                            <SelectItem value="utilities">Utilities</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Expense</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </header>

        {isMockMode && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
                <p className="font-bold">Preview Mode:</p>
                <p>Could not connect to the API. Showing sample data. Please check your backend server and CORS settings.</p>
            </div>
        )}

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Side: Recent History */}
            <div className="lg:col-span-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((t) => (
                                    <TableRow key={t.id}>
                                        <TableCell className="font-medium">{t.description}</TableCell>
                                        <TableCell>{t.category}</TableCell>
                                        <TableCell>{t.date}</TableCell>
                                        <TableCell className="text-right font-mono text-red-600">-${t.amount.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Right Side: Chart Tabs */}
            <div className="lg:col-span-2">
                <Tabs defaultValue="spending" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="spending">Spending</TabsTrigger>
                        <TabsTrigger value="trends">Trends</TabsTrigger>
                        <TabsTrigger value="budget">Budget</TabsTrigger>
                    </TabsList>
                    <TabsContent value="spending">
                        <Card>
                            <CardHeader><CardTitle>Spending by Category</CardTitle></CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={spendingData} dataKey="total" nameKey="categoryName" cx="50%" cy="50%" innerRadius={60} outerRadius={80}>
                                            {spendingData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="trends">
                        <Card>
                             <CardHeader><CardTitle>Monthly Trends</CardTitle></CardHeader>
                             <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={trendsData}>
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Line type="monotone" dataKey="total" stroke="#8884d8" />
                                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                                    </LineChart>
                                </ResponsiveContainer>
                             </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="budget">
                        <Card>
                            <CardHeader><CardTitle>Budget vs. Actuals</CardTitle></CardHeader>
                             <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={budgetData}>
                                        <XAxis dataKey="categoryName" />
                                        <YAxis />
                                        <Bar dataKey="budgeted" fill="#8884d8" />
                                        <Bar dataKey="spent" fill="#82ca9d" />
                                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                                    </BarChart>
                                </ResponsiveContainer>
                             </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

