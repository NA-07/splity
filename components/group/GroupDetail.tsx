'use client'

import { Group } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { addGroupMember, removeGroupMember } from '@/services/groups'
import { formatDate } from '@/lib/formatters'

interface GroupDetailProps {
  group: Group
  currentUserId: string
  onUpdate?: () => void
}

export default function GroupDetail({ group, currentUserId, onUpdate }: GroupDetailProps) {
  const [memberEmail, setMemberEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isAdmin = group.members.some(
    m => m.userId === currentUserId && m.role === 'admin'
  )

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await addGroupMember(group.id, {
        userId: memberEmail, // In production, you'd look up the user by email
        email: memberEmail,
        displayName: memberEmail,
        role: 'member',
      })
      setMemberEmail('')
      onUpdate?.()
    } catch (err) {
      setError((err as Error).message || 'Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return

    setLoading(true)
    try {
      await removeGroupMember(group.id, userId)
      onUpdate?.()
    } catch (err) {
      setError((err as Error).message || 'Failed to remove member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
          <CardDescription>{group.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Created {formatDate(group.createdAt)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members ({group.members.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {group.members.map((member) => (
              <div
                key={member.userId}
                className="flex justify-between items-center p-2 rounded bg-muted/50"
              >
                <div>
                  <p className="font-medium">{member.displayName}</p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {member.role === 'admin' && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Admin
                    </span>
                  )}
                  {isAdmin && member.userId !== currentUserId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.userId)}
                      disabled={loading}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isAdmin && (
            <form onSubmit={handleAddMember} className="space-y-3 pt-4 border-t">
              {error && (
                <div className="p-2 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="memberEmail">Add Member</Label>
                <div className="flex gap-2">
                  <Input
                    id="memberEmail"
                    type="email"
                    placeholder="member@email.com"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" disabled={loading}>
                    Add
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
