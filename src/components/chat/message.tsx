'use client'

import type { Message as MessageType } from '@ai-sdk/react'
import { CommunityList } from '../communities/community-list'
import type { CommunityData } from '@/lib/types'
import { UserIcon, BotIcon } from 'lucide-react'

interface MessageProps {
  message: MessageType
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user'

  // Extract communities from data parts
  const communitiesData = message.content
    .filter((part): part is CommunityData => 
      typeof part === 'object' && part !== null && 'type' in part && part.type === 'communities'
    )
    .flatMap((part) => part.communities)

  // Extract text content
  const textContent = message.content
    .filter((part): part is { type: 'text'; text: string } => 
      typeof part === 'object' && part !== null && 'type' in part && part.type === 'text'
    )
    .map((part) => part.text)
    .join('')

  return (
    <div
      className={`flex gap-3 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <BotIcon className="h-5 w-5 text-primary-foreground" />
        </div>
      )}

      <div
        className={`flex flex-col gap-3 max-w-[80%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {textContent && (
          <div
            className={`px-4 py-3 rounded-lg ${
              isUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground'
            }`}
          >
            <div className="whitespace-pre-wrap">{textContent}</div>
          </div>
        )}

        {communitiesData.length > 0 && (
          <div className="w-full">
            <CommunityList communities={communitiesData} />
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <UserIcon className="h-5 w-5 text-secondary-foreground" />
        </div>
      )}
    </div>
  )
}
