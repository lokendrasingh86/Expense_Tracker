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
        )}

        {activeTab === "trends" && (
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
        )}

        {activeTab === "budget" && (
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
        )}
      </CardContent>
    </Card>
  );
};
