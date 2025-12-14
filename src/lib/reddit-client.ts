import axios from 'axios'
import type { RedditCommunity } from './types'

export class RedditClient {
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  constructor(
    private clientId?: string,
    private clientSecret?: string
  ) {
    this.clientId = clientId || process.env.REDDIT_CLIENT_ID
    this.clientSecret = clientSecret || process.env.REDDIT_CLIENT_SECRET
  }

  private async getAccessToken(): Promise<string | null> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    // If credentials are provided, use OAuth
    if (this.clientId && this.clientSecret) {
      try {
        const auth = Buffer.from(
          `${this.clientId}:${this.clientSecret}`
        ).toString('base64')

        const response = await axios.post(
          'https://www.reddit.com/api/v1/access_token',
          'grant_type=client_credentials',
          {
            headers: {
              Authorization: `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )

        this.accessToken = response.data.access_token
        this.tokenExpiry = Date.now() + response.data.expires_in * 1000
        return this.accessToken
      } catch (error) {
        console.error('Failed to get Reddit access token:', error)
        // Fall through to anonymous access
      }
    }

    // Return empty string for anonymous access
    return ''
  }

  async searchCommunities(
    query: string,
    limit: number = 10
  ): Promise<RedditCommunity[]> {
    const token = await this.getAccessToken()

    const headers: Record<string, string> = {
      'User-Agent': 'RedditCommunityFinder/1.0',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await axios.get(
        'https://www.reddit.com/subreddits/search.json',
        {
          params: {
            q: query,
            limit: Math.min(limit, 25),
            sort: 'relevance',
          },
          headers,
        }
      )

      const communities: RedditCommunity[] = response.data.data.children.map(
        (child: any) => ({
          name: child.data.display_name,
          display_name: child.data.display_name_prefixed,
          title: child.data.title,
          description: child.data.public_description || child.data.description || 'No description available',
          subscribers: child.data.subscribers || 0,
          url: `https://reddit.com${child.data.url}`,
          created_utc: child.data.created_utc,
          public_description: child.data.public_description || 'No description available',
          icon_img: child.data.icon_img || child.data.community_icon || null,
        })
      )

      return communities
    } catch (error) {
      console.error('Reddit API error:', error)
      throw new Error('Failed to search Reddit communities')
    }
  }
}
