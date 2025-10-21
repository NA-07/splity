'use client'

import { Group } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Users } from 'lucide-react'

interface GroupListProps {
  groups: Group[]
}

export default function GroupList({ groups }: GroupListProps) {
  if (groups.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No groups yet. Create one to get started!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <Link key={group.id} href={`/groups/${group.id}`}>
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors h-full">
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {group.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{group.members.length} members</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
