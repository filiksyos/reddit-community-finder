import type { ChatUIMessage } from '@/lib/chat-context'
import type { ToolUIPart } from 'ai'
import type { CommunityData } from '@/lib/types'
import { Text } from './text'
import { ToolUI } from './tool-ui'
import { PresentCommunities } from './present-communities'
import { memo } from 'react'

interface Props {
  part: ChatUIMessage['parts'][number]
  partIndex: number
}

export const MessagePart = memo(function MessagePart({
  part,
}: Props) {
  // Handle step-start parts (multi-step tool boundaries)
  if (part.type === 'step-start') {
    return null // Or render a visual separator if desired
  }

  // Handle data parts with communities
  if (part.type === 'data') {
    // Check for 'content' property (standard structure from presentCommunities tool)
    if ('content' in part && Array.isArray(part.content)) {
      const dataParts = part.content.filter(
        (item): item is CommunityData =>
          typeof item === 'object' &&
          item !== null &&
          'type' in item &&
          item.type === 'communities'
      )
      if (dataParts.length > 0) {
        const communities = dataParts.flatMap((dp) => dp.communities)
        return <PresentCommunities message={{ communities }} />
      }
    }
    return null
  } else if (part.type === 'text' && 'text' in part) {
    return <Text part={part as { type: 'text'; text: string }} />
  } else if (typeof part.type === 'string' && part.type.startsWith('tool-') && 'toolCallId' in part) {
    // Handle AI SDK tool calls (tool-*)
    return <ToolUI part={part as unknown as ToolUIPart} />
  }
  
  return null
})
