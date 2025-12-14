'use client'

import { ChatInterface } from '@/components/chat/chat-interface'
import { SearchIcon } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-[color:hsl(var(--border))] bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <SearchIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">
                Reddit Community Finder
              </h1>
              <p className="text-sm text-muted-foreground">
                Discover the perfect subreddit with AI-powered search
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  )
}
