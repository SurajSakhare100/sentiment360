import { NextResponse } from 'next/server'
import { getRedditDiscussions } from '@/lib/reddit'

export async function POST(request: Request) {
  try {
    const { businessName, timeFrame = 'monthly', limit = 50 } = await request.json()

    if (!businessName) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      )
    }

    const discussions = await getRedditDiscussions(businessName, limit)
    return NextResponse.json({ discussions })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Reddit discussions'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 