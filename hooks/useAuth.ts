'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { User } from '@/types'
import { getCurrentUser } from '@/services/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        try {
          if (firebaseUser) {
            const userData = await getCurrentUser()
            setUser(userData)
          } else {
            setUser(null)
          }
        } catch (err) {
          setError((err as Error).message)
          setUser(null)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => unsubscribe()
  }, [])

  return { user, loading, error }
}
