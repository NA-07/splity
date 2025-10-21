'use client'

import { useAuth } from '@/hooks/useAuth'
import { useExpenses } from '@/hooks/useExpenses'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ExpenseList from '@/components/expense/ExpenseList'

export default function ExpensesPage() {
  const { user } = useAuth()
  const { expenses, loading } = useExpenses('user', user?.uid)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">All Expenses</h1>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading expenses...</p>
        ) : (
          <ExpenseList expenses={expenses} currentUserId={user?.uid} />
        )}
      </div>
    </DashboardLayout>
  )
}
