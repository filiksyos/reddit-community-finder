import type { InferUITools, UIMessage, UIMessageStreamWriter } from 'ai'
import type { ChatUIMessage } from '@/lib/chat-context'
import { searchCommunities } from './search-communities'
import { presentCommunities } from './present-communities'

interface Params {
  writer: UIMessageStreamWriter<UIMessage>
  messages?: ChatUIMessage[]
}

type RedditTools = {
  searchCommunities: ReturnType<typeof searchCommunities>
  presentCommunities: ReturnType<typeof presentCommunities>
}

export function tools({ writer }: Params): RedditTools {
  return {
    searchCommunities: searchCommunities({ writer }),
    presentCommunities: presentCommunities({ writer }),
  }
}

export type ToolSet = InferUITools<RedditTools>
