import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Settlement, Balance, UserBalance } from '@/types'
import { getGroupExpenses } from './expenses'

export async function createSettlement(
  settlementData: Omit<Settlement, 'id' | 'createdAt' | 'settledAt'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'settlements'), {
      ...settlementData,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function getSettlement(settlementId: string): Promise<Settlement | null> {
  try {
    const settlementDoc = await getDoc(doc(db, 'settlements', settlementId))
    if (!settlementDoc.exists()) return null

    const data = settlementDoc.data()
    return {
      id: settlementDoc.id,
      groupId: data.groupId,
      fromUserId: data.fromUserId,
      toUserId: data.toUserId,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      createdAt: data.createdAt?.toDate() || new Date(),
      settledAt: data.settledAt?.toDate(),
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function getGroupSettlements(groupId: string): Promise<Settlement[]> {
  try {
    const settlementsQuery = query(
      collection(db, 'settlements'),
      where('groupId', '==', groupId)
    )

    const snapshot = await getDocs(settlementsQuery)
    const settlements: Settlement[] = []

    snapshot.forEach((doc) => {
      const data = doc.data()
      settlements.push({
        id: doc.id,
        groupId: data.groupId,
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        createdAt: data.createdAt?.toDate() || new Date(),
        settledAt: data.settledAt?.toDate(),
      })
    })

    return settlements
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function markSettlementComplete(settlementId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'settlements', settlementId), {
      status: 'completed',
      settledAt: serverTimestamp(),
    })
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function calculateGroupBalances(groupId: string): Promise<Balance[]> {
  try {
    const expenses = await getGroupExpenses(groupId)
    const balances = new Map<string, { owes: Map<string, number>; owedBy: Map<string, number> }>()

    // Initialize balances for all users
    expenses.forEach((expense) => {
      if (!balances.has(expense.paidBy)) {
        balances.set(expense.paidBy, { owes: new Map(), owedBy: new Map() })
      }
      expense.splits.forEach((split) => {
        if (!balances.has(split.userId)) {
          balances.set(split.userId, { owes: new Map(), owedBy: new Map() })
        }
      })
    })

    // Calculate balances
    expenses.forEach((expense) => {
      expense.splits.forEach((split) => {
        if (split.userId !== expense.paidBy && !split.paid) {
          const userBalance = balances.get(split.userId)!
          const paidByBalance = balances.get(expense.paidBy)!

          const currentOwes = userBalance.owes.get(expense.paidBy) || 0
          userBalance.owes.set(expense.paidBy, currentOwes + split.amount)

          const currentOwedBy = paidByBalance.owedBy.get(split.userId) || 0
          paidByBalance.owedBy.set(split.userId, currentOwedBy + split.amount)
        }
      })
    })

    // Convert to Balance array
    const result: Balance[] = []
    balances.forEach((value, userId) => {
      const owes: UserBalance[] = []
      const owedBy: UserBalance[] = []
      let totalBalance = 0

      value.owes.forEach((amount, otherUserId) => {
        owes.push({ userId: otherUserId, displayName: '', amount })
        totalBalance -= amount
      })

      value.owedBy.forEach((amount, otherUserId) => {
        owedBy.push({ userId: otherUserId, displayName: '', amount })
        totalBalance += amount
      })

      result.push({
        userId,
        groupId,
        balance: totalBalance,
        owes,
        owedBy,
      })
    })

    return result
  } catch (error: any) {
    throw new Error(error.message)
  }
}
