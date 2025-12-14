'use client'

import type { ChatUIMessage } from '@/lib/chat-context'
import { MessagePart } from './message-part/index'
import { memo } from 'react'

interface Props {
  message: ChatUIMessage
}

export const Message = memo(function Message({ message }: Props) {

  // Check if message has a presentCommunities tool call or data part with communities
  const hasResults = message.parts.some(
    (part) => {
      // Check if it's a data part with communities
      if (part.type === 'data' && 'content' in part && Array.isArray(part.content)) {
        return part.content.some(
          (item) =>
            typeof item === 'object' &&
            item !== null &&
            'type' in item &&
            item.type === 'communities'
        )
      }
      // Check if it's a tool call part with presentCommunities
      if (typeof part.type === 'string' && part.type.startsWith('tool-')) {
        const toolPart = part as { toolName?: string; type: string }
        const isPresent = toolPart.toolName === 'presentCommunities' || 
                         String(toolPart.type).includes('presentCommunities')
        return isPresent
      }
      return false
    }
  )
  
  return (
    <div className="space-y-4">
      {message.parts.map((part, index) => {
        // Skip text parts if message has results (blocks summary)
        if (hasResults && part.type === 'text') {
          return null
        }
        
        return <MessagePart key={index} part={part} partIndex={index} />
      })}
    </div>
  )
})
