# Dashboard Components

This directory contains the modular components that make up the Dashboard page. The original 1064-line DashboardPage has been broken down into smaller, maintainable components.

## Components

### 1. **SummaryCards.tsx** (~70 lines)

- Displays the financial summary cards (Total Income, Total Expenses, Balance)
- Handles loading states
- Responsive design for different screen sizes

### 2. **AddTransactionDialogs.tsx** (~200 lines)

- Contains all dialog forms for adding new transactions
- Includes Income, Expense, and Budget dialogs
- Form validation and submission handling

### 3. **DashboardCharts.tsx** (~100 lines)

- All chart components using Recharts
- Tabbed interface for different chart types
- Spending by Category (Pie Chart)
- Monthly Trends (Line Chart)
- Budget vs Actual (Bar Chart)

### 4. **TransactionsTable.tsx** (~180 lines)

- Displays recent transactions in a table format
- Edit and Delete functionality
- Transaction management dialogs

## Hook

### **useDashboardData.ts** (~200 lines)

- Custom hook that manages all dashboard state and logic
- API calls and data fetching
- Form state management
- Dialog state management
- CRUD operations for transactions and budgets

## Benefits

✅ **Maintainability**: Each component has a single responsibility
✅ **Reusability**: Components can be reused in other parts of the app
✅ **Testability**: Smaller components are easier to test
✅ **Readability**: Much easier to understand and modify
✅ **Performance**: Better code splitting and lazy loading potential
✅ **Team Development**: Different developers can work on different components

## Usage

```tsx
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  SummaryCards,
  AddTransactionDialogs,
  DashboardCharts,
  TransactionsTable,
} from "@/components/dashboard";
```

## Original vs New Structure

- **Original**: 1 file, 1064 lines ❌
- **New**: 5 files, ~750 total lines ✅
- **Average component size**: ~150 lines ✅
- **Separation of concerns**: ✅
- **Production ready**: ✅
