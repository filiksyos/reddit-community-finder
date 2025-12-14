export interface RedditCommunity {
  name: string
  display_name: string
  title: string
  description: string
  subscribers: number
  url: string
  created_utc: number
  public_description: string
  icon_img?: string | null
}

export interface CommunityData {
  type: 'communities'
  communities: RedditCommunity[]
}
