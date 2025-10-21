'use client'

import { Expense } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/formatters'
import { markSplitAsPaid, deleteExpense } from '@/services/expenses'
import { useState } from 'react'

interface ExpenseDetailProps {
  expense: Expense
  currentUserId: string
  onUpdate?: () => void
  onDelete?: () => void
}

export default function ExpenseDetail({ expense, currentUserId, onUpdate, onDelete }: ExpenseDetailProps) {
  const [loading, setLoading] = useState(false)
  const isPayer = expense.paidBy === currentUserId
  const userSplit = expense.splits.find(s => s.userId === currentUserId)

  const handleMarkPaid = async () => {
    setLoading(true)
    try {
      await markSplitAsPaid(expense.id, currentUserId)
      onUpdate?.()
    } catch (err) {
      console.error('Failed to mark as paid:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this expense?')) return
    
    setLoading(true)
    try {
      await deleteExpense(expense.id)
      onDelete?.()
    } catch (err) {
      console.error('Failed to delete expense:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{expense.description}</CardTitle>
        <CardDescription>
          {formatDate(expense.date)} • {expense.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-2xl font-bold">${expense.amount.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Total amount</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Split Details</h3>
          <div className="space-y-2">
            {expense.splits.map((split) => (
              <div
                key={split.userId}
                className="flex justify-between items-center p-2 rounded bg-muted/50"
              >
                <span>{split.userId === currentUserId ? 'You' : split.userId}</span>
                <div className="text-right">
                  <span className="font-medium">${split.amount.toFixed(2)}</span>
                  {split.paid && (
                    <span className="ml-2 text-xs text-green-600">✓ Paid</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {userSplit && !userSplit.paid && !isPayer && (
            <Button onClick={handleMarkPaid} disabled={loading} className="flex-1">
              Mark as Paid
            </Button>
          )}
          {isPayer && (
            <Button
              onClick={handleDelete}
              disabled={loading}
              variant="destructive"
              className="flex-1"
            >
              Delete Expense
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
