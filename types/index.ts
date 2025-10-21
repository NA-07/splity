export interface User {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Group {
  id: string
  name: string
  description: string
  createdBy: string
  members: GroupMember[]
  createdAt: Date
  updatedAt: Date
}

export interface GroupMember {
  userId: string
  email: string
  displayName: string
  role: 'admin' | 'member'
  joinedAt: Date
}

export interface Expense {
  id: string
  groupId: string
  description: string
  amount: number
  currency: string
  paidBy: string
  splitType: 'equal' | 'exact' | 'percentage'
  splits: ExpenseSplit[]
  category: string
  date: Date
  createdAt: Date
  updatedAt: Date
}

export interface ExpenseSplit {
  userId: string
  amount: number
  percentage?: number
  paid: boolean
}

export interface Settlement {
  id: string
  groupId: string
  fromUserId: string
  toUserId: string
  amount: number
  currency: string
  status: 'pending' | 'completed'
  createdAt: Date
  settledAt?: Date
}

export interface Balance {
  userId: string
  groupId: string
  balance: number
  owes: UserBalance[]
  owedBy: UserBalance[]
}

export interface UserBalance {
  userId: string
  displayName: string
  amount: number
}
