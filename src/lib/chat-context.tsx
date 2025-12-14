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
  const { messages, sendMessage, status, error, reload, stop } = useChat<ChatUIMessage>({
    api: '/api/chat',
    maxSteps: 40,
  })

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

  const contextValue: ChatContextType = {
    messages: messages || [],
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
