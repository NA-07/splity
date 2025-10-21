'use client'

import { useAuth } from '@/hooks/useAuth'
import { useGroups } from '@/hooks/useGroups'
import { useExpenses } from '@/hooks/useExpenses'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import GroupList from '@/components/group/GroupList'
import ExpenseList from '@/components/expense/ExpenseList'

export default function DashboardPage() {
  const { user } = useAuth()
  const { groups, loading: groupsLoading } = useGroups(user?.uid)
  const { expenses, loading: expensesLoading } = useExpenses('user', user?.uid)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Link href="/groups">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Group
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{groups.length}</CardTitle>
              <CardDescription>Active Groups</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{expenses.length}</CardTitle>
              <CardDescription>Total Expenses</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                ${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
              </CardTitle>
              <CardDescription>Total Amount</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>
          {groupsLoading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Loading groups...</p>
              </CardContent>
            </Card>
          ) : (
            <GroupList groups={groups.slice(0, 3)} />
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Expenses</h2>
          {expensesLoading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Loading expenses...</p>
              </CardContent>
            </Card>
          ) : (
            <ExpenseList expenses={expenses.slice(0, 5)} currentUserId={user?.uid} />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
