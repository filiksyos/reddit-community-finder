'use client'

import type { RedditCommunity } from '@/lib/types'
import { CommunityCard } from './community-card'

interface CommunityListProps {
  communities: RedditCommunity[]
}

export function CommunityList({ communities }: CommunityListProps) {
  if (communities.length === 0) {
    return null
  }

  return (
    <div className="w-full space-y-3">
      <div className="text-sm font-medium text-muted-foreground px-1">
        Found {communities.length} {communities.length === 1 ? 'community' : 'communities'}
      </div>
      <div className="space-y-3">
        {communities.map((community) => (
          <CommunityCard key={community.name} community={community} />
        ))}
      </div>
    </div>
  )
}
