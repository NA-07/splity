'use client'

import { Balance } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/formatters'
import { createSettlement } from '@/services/settlements'
import { useState } from 'react'

interface SettleUpProps {
  groupId: string
  balances: Balance[]
  currentUserId: string
  onSettlement?: () => void
}

export default function SettleUp({ groupId, balances, currentUserId, onSettlement }: SettleUpProps) {
  const [loading, setLoading] = useState(false)
  const userBalance = balances.find(b => b.userId === currentUserId)

  const handleSettle = async (toUserId: string, amount: number) => {
    setLoading(true)
    try {
      await createSettlement({
        groupId,
        fromUserId: currentUserId,
        toUserId,
        amount,
        currency: 'USD',
        status: 'pending',
      })
      onSettlement?.()
    } catch (err) {
      console.error('Failed to create settlement:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!userBalance || userBalance.owes.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settle Up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {userBalance.owes.map((owe) => (
          <div
            key={owe.userId}
            className="flex justify-between items-center p-3 rounded border"
          >
            <div>
              <p className="font-medium">{owe.displayName || owe.userId}</p>
              <p className="text-sm text-muted-foreground">
                You owe {formatCurrency(owe.amount)}
              </p>
            </div>
            <Button
              onClick={() => handleSettle(owe.userId, owe.amount)}
              disabled={loading}
              size="sm"
            >
              Settle
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
