'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useGroups } from '@/hooks/useGroups'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import CreateGroupForm from '@/components/group/CreateGroupForm'
import GroupList from '@/components/group/GroupList'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function GroupsPage() {
  const { user } = useAuth()
  const { groups, loading, refetch } = useGroups(user?.uid)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const router = useRouter()

  const handleGroupCreated = (groupId: string) => {
    setShowCreateForm(false)
    refetch()
    router.push(`/groups/${groupId}`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Groups</h1>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="w-4 h-4 mr-2" />
            New Group
          </Button>
        </div>

        {showCreateForm && (
          <CreateGroupForm onSuccess={handleGroupCreated} />
        )}

        {loading ? (
          <p className="text-center text-muted-foreground">Loading groups...</p>
        ) : (
          <GroupList groups={groups} />
        )}
      </div>
    </DashboardLayout>
  )
}
