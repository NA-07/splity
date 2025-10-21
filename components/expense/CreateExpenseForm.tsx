'use client'

import { useState } from 'react'
import { createExpense } from '@/services/expenses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Group, ExpenseSplit } from '@/types'

interface CreateExpenseFormProps {
  group: Group
  userId: string
  onSuccess?: () => void
}

export default function CreateExpenseForm({ group, userId, onSuccess }: CreateExpenseFormProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('General')
  const [splitType, setSplitType] = useState<'equal' | 'exact' | 'percentage'>('equal')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const expenseAmount = parseFloat(amount)
      if (isNaN(expenseAmount) || expenseAmount <= 0) {
        throw new Error('Please enter a valid amount')
      }

      // Create equal splits for all members
      const splitAmount = expenseAmount / group.members.length
      const splits: ExpenseSplit[] = group.members.map(member => ({
        userId: member.userId,
        amount: splitAmount,
        paid: member.userId === userId,
      }))

      await createExpense({
        groupId: group.id,
        description,
        amount: expenseAmount,
        currency: 'USD',
        paidBy: userId,
        splitType,
        splits,
        category,
        date: new Date(),
      })

      setDescription('')
      setAmount('')
      setCategory('General')
      onSuccess?.()
    } catch (err) {
      setError((err as Error).message || 'Failed to create expense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
        <CardDescription>Create a new expense for {group.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="What was this expense for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              type="text"
              placeholder="General"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="splitType">Split Type</Label>
            <select
              id="splitType"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={splitType}
              onChange={(e) => setSplitType(e.target.value as 'equal' | 'exact' | 'percentage')}
            >
              <option value="equal">Equal Split</option>
              <option value="exact">Exact Amounts</option>
              <option value="percentage">By Percentage</option>
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Expense'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
