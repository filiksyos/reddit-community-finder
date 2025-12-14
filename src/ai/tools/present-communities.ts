import type { UIMessageStreamWriter, UIMessage } from 'ai'
import { tool } from 'ai'
import z from 'zod'
import type { RedditCommunity } from '@/lib/types'

interface Params {
  writer: UIMessageStreamWriter<UIMessage>
}

export const presentCommunities = ({ writer }: Params) =>
  tool({
    description:
      'Present Reddit communities to the user in a structured, visual format. MUST be called immediately after searchCommunities.',
    inputSchema: z.object({
      communities: z
        .array(
          z.object({
            name: z.string().describe('Subreddit name without r/ prefix'),
            display_name: z.string().describe('Display name with r/ prefix'),
            title: z.string().describe('Community title'),
            description: z.string().describe('Full community description'),
            subscribers: z.number().describe('Number of subscribers'),
            url: z.string().describe('Full Reddit URL'),
            created_utc: z.number().describe('Creation timestamp'),
            public_description: z.string().describe('Short public description'),
          })
        )
        .describe('Array of Reddit communities to present'),
    }),
    execute: async ({ communities }, { toolCallId: _toolCallId }) => {
      console.log(`📊 Presenting ${communities.length} communities`)
      console.log(`📦 Community names:`, communities.map(c => c.display_name).join(', '))

      // Don't write data part - ToolUI will render from the output
      // This prevents double rendering

      // Return object with communities for ToolUI to render
      // Also return formatted text for AI context
      const communityList = communities.map((community, index) => {
        return `${index + 1}. **${community.display_name}** - ${community.title}
   ${community.public_description || community.description}
   👥 ${community.subscribers.toLocaleString()} members | 🔗 ${community.url}`
      }).join('\n\n')

      // Return object with communities for ToolUI, and formatted text
      return {
        communities: communities as RedditCommunity[],
        message: `✅ Successfully presented ${communities.length} Reddit communities to the user.

## Communities Found

${communityList}

---
*💡 These communities are displayed above for easy reference*`
      }
    },
  })
