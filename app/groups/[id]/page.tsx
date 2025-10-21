'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useGroup } from '@/hooks/useGroups'
import { useExpenses } from '@/hooks/useExpenses'
import DashboardLayout from '@/components/layout/DashboardLayout'
import GroupDetail from '@/components/group/GroupDetail'
import CreateExpenseForm from '@/components/expense/CreateExpenseForm'
import ExpenseList from '@/components/expense/ExpenseList'
import BalanceSummary from '@/components/split/BalanceSummary'
import SettleUp from '@/components/split/SettleUp'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { calculateGroupBalances } from '@/services/settlements'
import { Balance } from '@/types'
import { useEffect } from 'react'

export default function GroupDetailPage() {
  const params = useParams()
  const groupId = params.id as string
  const { user } = useAuth()
  const { group, loading: groupLoading, refetch: refetchGroup } = useGroup(groupId)
  const { expenses, loading: expensesLoading, refetch: refetchExpenses } = useExpenses('group', groupId)
  const [showCreateExpense, setShowCreateExpense] = useState(false)
  const [balances, setBalances] = useState<Balance[]>([])

  useEffect(() => {
    if (groupId) {
      calculateGroupBalances(groupId).then(setBalances)
    }
  }, [groupId, expenses])

  const handleExpenseCreated = () => {
    setShowCreateExpense(false)
    refetchExpenses()
  }

  if (groupLoading || !group || !user) {
    return (
      <DashboardLayout>
        <p className="text-center text-muted-foreground">Loading...</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <Button onClick={() => setShowCreateExpense(!showCreateExpense)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {showCreateExpense && (
              <CreateExpenseForm
                group={group}
                userId={user.uid}
                onSuccess={handleExpenseCreated}
              />
            )}

            <div>
              <h2 className="text-2xl font-semibold mb-4">Expenses</h2>
              {expensesLoading ? (
                <p className="text-center text-muted-foreground">Loading expenses...</p>
              ) : (
                <ExpenseList expenses={expenses} currentUserId={user.uid} />
              )}
            </div>
          </div>

          <div className="space-y-6">
            <BalanceSummary balances={balances} currentUserId={user.uid} />
            <SettleUp
              groupId={groupId}
              balances={balances}
              currentUserId={user.uid}
              onSettlement={() => {
                refetchExpenses()
                calculateGroupBalances(groupId).then(setBalances)
              }}
            />
            <GroupDetail
              group={group}
              currentUserId={user.uid}
              onUpdate={refetchGroup}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
