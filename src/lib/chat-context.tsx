'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useChat, type Message } from '@ai-sdk/react'

export type ChatUIMessage = Message

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
  const chat = useChat({
    api: '/api/chat',
    maxSteps: 40,
  })

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider')
  }
  return context
}
