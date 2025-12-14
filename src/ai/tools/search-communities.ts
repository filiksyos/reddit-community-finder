import type { UIMessageStreamWriter, UIMessage } from 'ai'
import { tool } from 'ai'
import description from './search-communities.md'
import z from 'zod'
import { RedditClient } from '@/lib/reddit-client'

interface Params {
  writer: UIMessageStreamWriter<UIMessage>
}

export const searchCommunities = ({ writer: _writer }: Params) =>
  tool({
    description,
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          'Search query for Reddit communities (e.g., "programming", "fitness", "gaming")'
        ),
      limit: z
        .number()
        .min(1)
        .max(25)
        .optional()
        .describe('Number of results (1-25, default: 10)'),
    }),
    execute: async ({ query, limit }, { toolCallId: _toolCallId }) => {
      try {
        console.log(`🔍 Searching Reddit communities: "${query}"`)

        const redditClient = new RedditClient()
        const communities = await redditClient.searchCommunities(query, limit || 10)

        console.log(`✅ Found ${communities.length} communities`)

        const topCommunities = communities.slice(0, limit || 10)

        return `✅ Search completed: Found ${communities.length} Reddit communities for query "${query}"

**⚠️ CRITICAL NEXT STEP:** You MUST immediately call the presentCommunities tool with the community data below. Do not provide any text response until after you've called presentCommunities.

Community data (JSON format - use this exact structure for presentCommunities):
\`\`\`json
${JSON.stringify({ communities: topCommunities }, null, 2)}
\`\`\`

Call presentCommunities with the "communities" array from the JSON above.`
      } catch (error: unknown) {
        const err = error as Error
        console.error('❌ Reddit search error:', err.message)

        return `❌ **Community Search Error**

Failed to search for communities with query: "${query}"

**Error:** ${err.message}

This could be due to:
- Reddit API rate limit exceeded
- Network connectivity issues
- Reddit API temporary unavailability

Please try again with a different query or wait a moment.`
      }
    },
  })
