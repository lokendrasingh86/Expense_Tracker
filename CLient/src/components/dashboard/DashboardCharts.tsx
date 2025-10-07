import React from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface DashboardChartsProps {
  spendingData: SpendingByCategory[];
  trendsData: MonthlySpendingTrend[];
  budgetData: BudgetVsActual[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  spendingData,
  trendsData,
  budgetData,
  activeTab,
  setActiveTab,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="spending">Spending by Category</TabsTrigger>
            <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
            <TabsTrigger value="budget">Budget vs Actual</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {activeTab === "spending" && (
          <>
            {spendingData && spendingData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={spendingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    label
                  >
                    {spendingData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[350px] items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <div className="text-lg font-medium">No Expenses Yet</div>
                  <div className="text-sm mt-2">
                    Start adding expenses to see your spending breakdown by
                    category
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "trends" && (
          <>
            {trendsData && trendsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#00C49F" />
                  <Line type="monotone" dataKey="expense" stroke="#FF8042" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[350px] items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">📈</div>
                  <div className="text-lg font-medium">
                    No Transaction History
                  </div>
                  <div className="text-sm mt-2">
                    Add some income and expenses to see your monthly trends
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "budget" && (
          <>
            {budgetData && budgetData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="budget" fill="#0088FE" />
                  <Bar dataKey="actual" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[350px] items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <div className="text-lg font-medium">No Budgets Set</div>
                  <div className="text-sm mt-2">
                    Create budgets for different categories to track your
                    spending goals
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
