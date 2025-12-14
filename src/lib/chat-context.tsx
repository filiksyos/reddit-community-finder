'use client'

import { createContext, useContext, ReactNode, useState } from 'react'
import { useChat } from '@ai-sdk/react'

export interface ChatUIMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  parts: Array<{
    type: 'text'
    text: string
  } | {
    type: 'data'
    content: Array<{
      type: 'communities'
      communities: Array<any>
    }>
  } | {
    type: string
    toolName?: string
    toolCallId?: string
    result?: any
    [key: string]: any
  }>
}

interface ChatContextType {
  messages: ChatUIMessage[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  error: Error | undefined
  reload: () => void
  stop: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState('')
  // Use type assertion to bypass type constraint - ChatUIMessage is compatible at runtime
  const chatHelpers = useChat({
    api: '/api/chat',
    maxSteps: 40,
  } as any)
  const { messages, sendMessage, status, error, stop } = chatHelpers
  // reload might not be in the type definition but exists at runtime
  const reload = (chatHelpers as any).reload as (() => void) | undefined

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim() && sendMessage) {
      sendMessage({ text: input })
      setInput('')
    }
  }

  const isLoading = status === 'streaming' || status === 'submitted'

  // Transform messages from UIMessage format back to ChatUIMessage format
  const transformedMessages: ChatUIMessage[] = (messages || []).map((msg: any) => ({
    id: msg.id,
    role: msg.role,
    text: msg.text || '',
    parts: (msg.parts || []).map((part: any) => {
      // Transform data-communities back to data format with content
      if (part.type === 'data-communities' && 'data' in part) {
        return {
          type: 'data' as const,
          content: part.data,
        }
      }
      // Pass through other parts as-is
      return part
    }),
  }))

  const contextValue: ChatContextType = {
    messages: transformedMessages,
    input: input || '',
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload: reload || (() => {}),
    stop: stop || (() => {}),
  }

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider')
  }
  return context
}
