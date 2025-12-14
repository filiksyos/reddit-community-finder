'use client'

import type { RedditCommunity } from '@/lib/types'
import { UsersIcon, ExternalLinkIcon } from 'lucide-react'

interface CommunityCardProps {
  community: RedditCommunity
}

export function CommunityCard({ community }: CommunityCardProps) {
  const subscriberCount = community.subscribers.toLocaleString()
  const createdDate = new Date(community.created_utc * 1000).toLocaleDateString()

  return (
    <a
      href={community.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-lg border border-[color:hsl(var(--border))] bg-card hover:bg-accent transition-colors group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
              {community.display_name}
            </h3>
            <ExternalLinkIcon className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {community.title}
          </p>
          <p className="text-sm line-clamp-2 mb-3">
            {community.public_description || community.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <UsersIcon className="h-4 w-4" />
              <span>{subscriberCount} members</span>
            </div>
            <div>Created {createdDate}</div>
          </div>
        </div>
      </div>
    </a>
  )
}
