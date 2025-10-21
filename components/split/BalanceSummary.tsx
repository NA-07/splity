'use client'

import { Balance } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatters'

interface BalanceSummaryProps {
  balances: Balance[]
  currentUserId: string
}

export default function BalanceSummary({ balances, currentUserId }: BalanceSummaryProps) {
  const userBalance = balances.find(b => b.userId === currentUserId)

  if (!userBalance) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No balance information available</p>
        </CardContent>
      </Card>
    )
  }

  const isPositive = userBalance.balance > 0
  const isZero = userBalance.balance === 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Balance</CardTitle>
        <CardDescription>Overall balance in this group</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p
            className={`text-4xl font-bold ${
              isZero
                ? 'text-muted-foreground'
                : isPositive
                ? 'text-green-600'
                : 'text-orange-600'
            }`}
          >
            {formatCurrency(Math.abs(userBalance.balance))}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {isZero
              ? 'All settled up!'
              : isPositive
              ? 'You are owed'
              : 'You owe'}
          </p>
        </div>

        {userBalance.owes.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">You owe:</h3>
            {userBalance.owes.map((owe) => (
              <div
                key={owe.userId}
                className="flex justify-between items-center p-2 rounded bg-orange-50 dark:bg-orange-950"
              >
                <span className="text-sm">{owe.displayName || owe.userId}</span>
                <span className="font-medium text-orange-600">
                  {formatCurrency(owe.amount)}
                </span>
              </div>
            ))}
          </div>
        )}

        {userBalance.owedBy.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Owed to you:</h3>
            {userBalance.owedBy.map((owed) => (
              <div
                key={owed.userId}
                className="flex justify-between items-center p-2 rounded bg-green-50 dark:bg-green-950"
              >
                <span className="text-sm">{owed.displayName || owed.userId}</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(owed.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
