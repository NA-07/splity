'use client'

import { useState, useEffect } from 'react'
import { Group } from '@/types'
import { getUserGroups, getGroup } from '@/services/groups'

export function useGroups(userId: string | undefined) {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    async function fetchGroups() {
      try {
        if (!userId) return
        const userGroups = await getUserGroups(userId)
        setGroups(userGroups)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [userId])

  return { groups, loading, error, refetch: () => {
    if (userId) {
      getUserGroups(userId).then(setGroups)
    }
  }}
}

export function useGroup(groupId: string | undefined) {
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!groupId) {
      setLoading(false)
      return
    }

    async function fetchGroup() {
      try {
        if (!groupId) return
        const groupData = await getGroup(groupId)
        setGroup(groupData)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchGroup()
  }, [groupId])

  return { group, loading, error, refetch: () => {
    if (groupId) {
      getGroup(groupId).then(setGroup)
    }
  }}
}
