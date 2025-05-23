"use client"

import { useState } from "react"
import { ExpenseForm } from "@/components/expense-form"
import { ExpenseList } from "@/components/expense-list"
import { ExpenseAnalytics } from "@/components/expense-analytics"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, BarChart3, ListChecks } from "lucide-react"

export type Expense = {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

const initialExpenses: Expense[] = [
  {
    id: "1",
    description: "Groceries",
    amount: 85.75,
    category: "Food",
    date: "2024-05-15",
  },
  {
    id: "2",
    description: "Electricity bill",
    amount: 120.5,
    category: "Utilities",
    date: "2024-05-10",
  },
  {
    id: "3",
    description: "Movie tickets",
    amount: 32.0,
    category: "Entertainment",
    date: "2024-05-18",
  },
  {
    id: "4",
    description: "Gas",
    amount: 45.25,
    category: "Transportation",
    date: "2024-05-12",
  },
  {
    id: "5",
    description: "Internet subscription",
    amount: 59.99,
    category: "Utilities",
    date: "2024-05-05",
  },
]

export function CostTracker() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: Math.random().toString(36).substring(2, 9),
    }
    setExpenses([...expenses, newExpense])
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl md:text-3xl font-bold">Cost Tracker</CardTitle>
          <CardDescription className="text-rose-100">
            Track your expenses and analyze your spending habits
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-rose-50 border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Total Spent</CardDescription>
                <CardTitle className="text-2xl font-bold text-rose-600">${totalSpent.toFixed(2)}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-pink-50 border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Number of Expenses</CardDescription>
                <CardTitle className="text-2xl font-bold text-pink-600">{expenses.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-amber-50 border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Average Expense</CardDescription>
                <CardTitle className="text-2xl font-bold text-amber-600">
                  ${(totalSpent / expenses.length).toFixed(2)}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="add" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Add Expense</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                <span className="hidden sm:inline">Expenses</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="add">
              <ExpenseForm onAddExpense={addExpense} />
            </TabsContent>
            <TabsContent value="list">
              <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
            </TabsContent>
            <TabsContent value="analytics">
              <ExpenseAnalytics expenses={expenses} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
