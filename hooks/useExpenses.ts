'use client'

import { useState, useEffect } from 'react'
import { Expense } from '@/types'
import { getGroupExpenses, getUserExpenses, getExpense } from '@/services/expenses'

export function useExpenses(
  type: 'user' | 'group',
  id: string | undefined
) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    async function fetchExpenses() {
      try {
        if (!id) return
        const data =
          type === 'user'
            ? await getUserExpenses(id)
            : await getGroupExpenses(id)
        setExpenses(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchExpenses()
  }, [id, type])

  return { expenses, loading, error, refetch: () => {
    if (id) {
      const fetchFn = type === 'user' ? getUserExpenses : getGroupExpenses
      fetchFn(id).then(setExpenses)
    }
  }}
}

export function useExpense(expenseId: string | undefined) {
  const [expense, setExpense] = useState<Expense | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!expenseId) {
      setLoading(false)
      return
    }

    async function fetchExpense() {
      try {
        if (!expenseId) return
        const data = await getExpense(expenseId)
        setExpense(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchExpense()
  }, [expenseId])

  return { expense, loading, error, refetch: () => {
    if (expenseId) {
      getExpense(expenseId).then(setExpense)
    }
  }}
}
