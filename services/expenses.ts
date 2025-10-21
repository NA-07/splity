import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Expense, ExpenseSplit } from '@/types'

export async function createExpense(
  expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'expenses'), {
      ...expenseData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function getExpense(expenseId: string): Promise<Expense | null> {
  try {
    const expenseDoc = await getDoc(doc(db, 'expenses', expenseId))
    if (!expenseDoc.exists()) return null

    const data = expenseDoc.data()
    return {
      id: expenseDoc.id,
      groupId: data.groupId,
      description: data.description,
      amount: data.amount,
      currency: data.currency,
      paidBy: data.paidBy,
      splitType: data.splitType,
      splits: data.splits,
      category: data.category,
      date: data.date?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function getGroupExpenses(groupId: string): Promise<Expense[]> {
  try {
    const expensesQuery = query(
      collection(db, 'expenses'),
      where('groupId', '==', groupId),
      orderBy('date', 'desc')
    )

    const snapshot = await getDocs(expensesQuery)
    const expenses: Expense[] = []

    snapshot.forEach((doc) => {
      const data = doc.data()
      expenses.push({
        id: doc.id,
        groupId: data.groupId,
        description: data.description,
        amount: data.amount,
        currency: data.currency,
        paidBy: data.paidBy,
        splitType: data.splitType,
        splits: data.splits,
        category: data.category,
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      })
    })

    return expenses
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function getUserExpenses(userId: string): Promise<Expense[]> {
  try {
    const allExpenses = await getDocs(collection(db, 'expenses'))
    const expenses: Expense[] = []

    allExpenses.forEach((doc) => {
      const data = doc.data()
      const isInvolved =
        data.paidBy === userId ||
        data.splits.some((split: ExpenseSplit) => split.userId === userId)

      if (isInvolved) {
        expenses.push({
          id: doc.id,
          groupId: data.groupId,
          description: data.description,
          amount: data.amount,
          currency: data.currency,
          paidBy: data.paidBy,
          splitType: data.splitType,
          splits: data.splits,
          category: data.category,
          date: data.date?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        })
      }
    })

    return expenses.sort((a, b) => b.date.getTime() - a.date.getTime())
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function updateExpense(
  expenseId: string,
  updates: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  try {
    await updateDoc(doc(db, 'expenses', expenseId), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function deleteExpense(expenseId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'expenses', expenseId))
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function markSplitAsPaid(
  expenseId: string,
  userId: string
): Promise<void> {
  try {
    const expenseDoc = await getDoc(doc(db, 'expenses', expenseId))
    if (!expenseDoc.exists()) {
      throw new Error('Expense not found')
    }

    const data = expenseDoc.data()
    const updatedSplits = data.splits.map((split: ExpenseSplit) =>
      split.userId === userId ? { ...split, paid: true } : split
    )

    await updateDoc(doc(db, 'expenses', expenseId), {
      splits: updatedSplits,
      updatedAt: serverTimestamp(),
    })
  } catch (error: any) {
    throw new Error(error.message)
  }
}
