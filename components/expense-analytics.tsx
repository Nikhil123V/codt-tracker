"use client"

import { useMemo } from "react"
import type { Expense } from "@/components/cost-tracker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie, PieChart, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

type ExpenseAnalyticsProps = {
  expenses: Expense[]
}

export function ExpenseAnalytics({ expenses }: ExpenseAnalyticsProps) {
  // Calculate expenses by category
  const expensesByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>()

    expenses.forEach((expense) => {
      const currentAmount = categoryMap.get(expense.category) || 0
      categoryMap.set(expense.category, currentAmount + expense.amount)
    })

    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value: Number.parseFloat(value.toFixed(2)),
    }))
  }, [expenses])

  // Calculate expenses by date (for the last 7 entries)
  const expensesByDate = useMemo(() => {
    const dateMap = new Map<string, number>()

    // Sort expenses by date
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Take only the last 7 entries
    const recentExpenses = sortedExpenses.slice(0, 7).reverse()

    recentExpenses.forEach((expense) => {
      const formattedDate = new Date(expense.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
      const currentAmount = dateMap.get(formattedDate) || 0
      dateMap.set(formattedDate, currentAmount + expense.amount)
    })

    return Array.from(dateMap.entries()).map(([date, amount]) => ({
      date,
      amount: Number.parseFloat(amount.toFixed(2)),
    }))
  }, [expenses])

  // Colors for the pie chart
  const COLORS = [
    "#f43f5e",
    "#ec4899",
    "#d946ef",
    "#a855f7",
    "#8b5cf6",
    "#6366f1",
    "#0ea5e9",
    "#14b8a6",
    "#10b981",
    "#84cc16",
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Expense Analytics</h2>
        <p className="text-sm text-muted-foreground">Visualize your spending patterns and identify trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Breakdown of your spending across different categories</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Spending Trend</CardTitle>
            <CardDescription>Your spending pattern over recent transactions</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {expensesByDate.length > 0 ? (
              <ChartContainer
                config={{
                  amount: {
                    label: "Amount",
                    color: "hsl(346, 87%, 60%)",
                  },
                }}
                className="h-[300px]"
              >
                <BarChart
                  accessibilityLayer
                  data={expensesByDate}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="amount" fill="var(--color-amount)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Highest Expense</CardDescription>
            <CardTitle className="text-2xl font-bold text-rose-600">
              ${Math.max(...expenses.map((e) => e.amount), 0).toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lowest Expense</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-600">
              ${Math.min(...expenses.map((e) => e.amount), 0).toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Most Common Category</CardDescription>
            <CardTitle className="text-xl font-bold text-violet-600">
              {(() => {
                const categoryCounts = expenses.reduce(
                  (acc, expense) => {
                    acc[expense.category] = (acc[expense.category] || 0) + 1
                    return acc
                  },
                  {} as Record<string, number>,
                )

                const entries = Object.entries(categoryCounts)
                if (entries.length === 0) return "N/A"

                return entries.sort((a, b) => b[1] - a[1])[0][0]
              })()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
