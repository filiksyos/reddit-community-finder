'use client'

import { useChatContext } from '@/lib/chat-context'
import { Message } from './message'
import { SendIcon, Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import * as ScrollArea from '@radix-ui/react-scroll-area'

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChatContext()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea.Root className="flex-1 overflow-hidden">
        <ScrollArea.Viewport className="h-full w-full">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold mb-2">
                  Find Your Perfect Community
                </h2>
                <p className="text-muted-foreground mb-8">
                  Ask me to help you discover Reddit communities based on your
                  interests.
                </p>
                <div className="grid gap-3 max-w-md mx-auto">
                  <div className="p-4 bg-muted/50 rounded-lg text-left">
                    <p className="text-sm font-medium mb-1">
                      Try asking:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      "Find me communities about web development"
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-left">
                    <p className="text-sm font-medium mb-1">
                      Or:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      "I want to learn about AI and machine learning"
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-muted transition-colors duration-150 ease-out hover:bg-muted/80 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-border rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {/* Input Area */}
      <div className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me to find Reddit communities..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <SendIcon className="h-5 w-5" />
                  <span>Send</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
