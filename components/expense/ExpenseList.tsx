'use client'

import { Expense } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/formatters'

interface ExpenseListProps {
  expenses: Expense[]
  currentUserId?: string
  onExpenseClick?: (expense: Expense) => void
}

export default function ExpenseList({ expenses, currentUserId, onExpenseClick }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No expenses yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => {
        const userSplit = expense.splits.find(s => s.userId === currentUserId)
        const isPayer = expense.paidBy === currentUserId

        return (
          <Card
            key={expense.id}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => onExpenseClick?.(expense)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{expense.description}</CardTitle>
                  <CardDescription>
                    {formatDate(expense.date)} • {expense.category}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">${expense.amount.toFixed(2)}</p>
                  {isPayer ? (
                    <p className="text-sm text-green-600">You paid</p>
                  ) : userSplit ? (
                    <p className="text-sm text-orange-600">
                      You owe ${userSplit.amount.toFixed(2)}
                    </p>
                  ) : null}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Split {expense.splitType}</span>
                <span>•</span>
                <span>{expense.splits.length} people</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
