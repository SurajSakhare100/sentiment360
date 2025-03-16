import axios from 'axios';

interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  created_utc: number;
  score: number;
  num_comments: number;
  url: string;
  subreddit: string;
}

// List of business-related subreddits to search in
const BUSINESS_SUBREDDITS = [
  'business',
  'smallbusiness',
  'entrepreneur',
  'startups',
  'BusinessHub',
  'marketing',
  'CustomerService',
  'BusinessIntelligence',
  'consulting',
  'Finance',
  'investing',
  'stocks',
  'wallstreetbets',
  'Economics',
  'BusinessStrategy',
  'BusinessNews'
]

export async function getRedditDiscussions(businessName: string, limit: number = 50): Promise<RedditPost[]> {
  // Ensure environment variables are set
  if (!process.env.REDDIT_CLIENT_ID || !process.env.REDDIT_CLIENT_SECRET) {
    throw new Error('Reddit API credentials not configured')
  }

  try {
    // Get access token
    const authResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    })

    const authData = await authResponse.json()

    if (!authResponse.ok) {
      throw new Error('Failed to authenticate with Reddit API')
    }

    // Build search query for business-related content
    const searchQuery = encodeURIComponent(`title:"${businessName}" OR selftext:"${businessName}"`)
    const subredditQuery = BUSINESS_SUBREDDITS.map(sub => `subreddit:${sub}`).join(' OR ')
    const fullQuery = `(${searchQuery}) AND (${subredditQuery})`

    // Search for posts
    const searchResponse = await fetch(
      `https://oauth.reddit.com/search?q=${fullQuery}&sort=relevance&t=year&limit=${limit}&restrict_sr=true`,
      {
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
        },
      }
    )

    const searchData = await searchResponse.json()

    if (!searchResponse.ok) {
      throw new Error('Failed to fetch discussions from Reddit')
    }

    // Process and filter results
    const discussions = searchData.data.children
      .map((child: any) => {
        const post = child.data
        return {
          id: post.id,
          title: post.title,
          selftext: post.selftext,
          created_utc: post.created_utc,
          score: post.score,
          num_comments: post.num_comments,
          url: `https://reddit.com${post.permalink}`,
          subreddit: post.subreddit,
        }
      })
      .filter((post: any) => {
        // Ensure post has either title or text content
        const hasContent = post.title || post.selftext
        // Check if the business name appears in the content (case-insensitive)
        const businessNameRegex = new RegExp(businessName, 'i')
        const mentionsBusiness = businessNameRegex.test(post.title) || businessNameRegex.test(post.selftext)
        return hasContent && mentionsBusiness
      })
      .slice(0, limit) // Ensure we don't exceed the limit

    return discussions
  } catch (error) {
    console.error('Reddit API Error:', error)
    throw new Error('Failed to fetch discussions from Reddit')
  }
} 