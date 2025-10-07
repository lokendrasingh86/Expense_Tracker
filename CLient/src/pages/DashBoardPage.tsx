import type { FC } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { AddTransactionDialogs } from "@/components/dashboard/AddTransactionDialogs";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";

const DashboardPage: FC = () => {
  const {
    // Data
    summary,
    transactions,
    categories,
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
  } = useDashboardData();

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-600">
            Overview of your financial activities
          </p>
        </div>
        
        <AddTransactionDialogs
          // Income Dialog Props
          isIncomeDialogOpen={isIncomeDialogOpen}
          setIsIncomeDialogOpen={setIsIncomeDialogOpen}
          newIncome={newIncome}
          setNewIncome={setNewIncome}
          
          // Expense Dialog Props
          isExpenseDialogOpen={isExpenseDialogOpen}
          setIsExpenseDialogOpen={setIsExpenseDialogOpen}
          newExpense={newExpense}
          setNewExpense={setNewExpense}
          
          // Budget Dialog Props
          isBudgetDialogOpen={isBudgetDialogOpen}
          setIsBudgetDialogOpen={setIsBudgetDialogOpen}
          newBudget={newBudget}
          setNewBudget={setNewBudget}
          
          // Common Props
          categories={categories}
          handleAddTransaction={handleAddTransaction}
          handleAddBudget={handleAddBudget}
        />
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} isLoading={isLoading} />


      {/* Transactions Table */}
      <TransactionsTable
        transactions={transactions}
        categories={categories}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        editingTransaction={editingTransaction}
        setEditingTransaction={setEditingTransaction}
        handleUpdateTransaction={handleUpdateTransaction}
        handleDeleteTransaction={handleDeleteTransaction}
        openEditDialog={openEditDialog}
      />

       {/* Charts */}
      <DashboardCharts
        spendingData={spendingData}
        trendsData={trendsData}
        budgetData={budgetData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default DashboardPage;