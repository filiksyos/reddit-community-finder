'use client'

import type { RedditCommunity } from '@/lib/types'
import { CommunityList } from '../../communities/community-list'

interface PresentCommunitiesProps {
  message: {
    communities: RedditCommunity[]
  }
}

export function PresentCommunities({ message }: PresentCommunitiesProps) {
  const { communities } = message

  if (!communities || communities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No communities found for your search.</p>
        <p className="text-muted-foreground mt-2">Try using different keywords or search terms.</p>
      </div>
    )
  }

  return <CommunityList communities={communities} />
}
