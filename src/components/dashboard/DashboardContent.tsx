'use client'

import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts'
import { analyzeSentiment, type SentimentResult } from '@/lib/sentiment'

interface RedditPost {
  id: string
  title: string
  selftext: string
  created_utc: number
  score: number
  num_comments: number
  url: string
  subreddit: string
  sentiment?: SentimentResult
  businessName?: string
}

interface SentimentTrend {
  date: string
  positive: number
  neutral: number
  negative: number
}

type Tab = 'discussions' | 'trends'
type TimeFrame = 'daily' | 'monthly'
type ChartType = 'line' | 'bar'

export default function DashboardContent() {
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(false)
  const [discussions, setDiscussions] = useState<RedditPost[]>([])
  const [error, setError] = useState('')
  const [sentimentTrends, setSentimentTrends] = useState<SentimentTrend[]>([])
  const [activeTab, setActiveTab] = useState<Tab>('discussions')
  const [selectedSubreddits, setSelectedSubreddits] = useState<string[]>([])
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>([])
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('monthly')
  const [chartType, setChartType] = useState<ChartType>('line')
  const [businesses, setBusinesses] = useState<string[]>([])
  const [comparisonMode, setComparisonMode] = useState(false)
  const [comparedBusinessName, setComparedBusinessName] = useState('')

  const subreddits = useMemo(() => {
    const subredditScores = discussions.reduce((acc, post) => {
      if (!acc[post.subreddit]) {
        acc[post.subreddit] = {
          count: 0,
          relevanceScore: 0,
          sentimentImpact: 0
        }
      }
      
      acc[post.subreddit].count++
      // Calculate relevance based on post score and comments
      acc[post.subreddit].relevanceScore += (post.score + post.num_comments)
      // Add sentiment impact
      if (post.sentiment) {
        acc[post.subreddit].sentimentImpact += Math.abs(post.sentiment.score.compound)
      }
      
      return acc
    }, {} as Record<string, { count: number; relevanceScore: number; sentimentImpact: number }>)

    return Object.entries(subredditScores)
      .sort((a, b) => {
        // Combined score based on post count, relevance, and sentiment impact
        const scoreA = a[1].count * 0.4 + a[1].relevanceScore * 0.4 + a[1].sentimentImpact * 0.2
        const scoreB = b[1].count * 0.4 + b[1].relevanceScore * 0.4 + b[1].sentimentImpact * 0.2
        return scoreB - scoreA
      })
      .slice(0, 10)
      .map(([subreddit]) => subreddit)
  }, [discussions])

  const filteredDiscussions = useMemo(() => {
    return discussions.filter(post => {
      const matchesSubreddit = selectedSubreddits.length === 0 || selectedSubreddits.includes(post.subreddit)
      const matchesSentiment = selectedSentiments.length === 0 || 
        (post.sentiment && selectedSentiments.includes(post.sentiment.sentiment))
      return matchesSubreddit && matchesSentiment
    })
  }, [discussions, selectedSubreddits, selectedSentiments])

  const analyzePosts = (posts: RedditPost[]): RedditPost[] => {
    return posts.map(post => {
      const sentiment = analyzeSentiment(post.title + ' ' + (post.selftext || ''))
      // Normalize sentiment scores to ensure they don't exceed 100%
      const scores = sentiment.score
      const total = Math.abs(scores.pos) + Math.abs(scores.neg) + Math.abs(scores.neu)
      const normalizedScore = {
        ...sentiment,
        score: {
          pos: (Math.abs(scores.pos) / total) * 100,
          neg: (Math.abs(scores.neg) / total) * 100,
          neu: (Math.abs(scores.neu) / total) * 100,
          compound: Math.min(Math.abs(sentiment.score.compound), 1) * (sentiment.score.compound < 0 ? -1 : 1) * 100
        }
      }
      return {
        ...post,
        sentiment: normalizedScore
      }
    })
  }

  const getButtonColors = (index: number) => {
    const colors = [
      { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', hex: '#3B82F6' },
      { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', hex: '#10B981' },
      { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', hex: '#8B5CF6' },
      { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300', hex: '#EC4899' },
      { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300', hex: '#6366F1' },
    ]
    const color = colors[index % colors.length]
    return `${color.bg} ${color.text} ${color.border}`
  }

  const calculateTrends = (posts: RedditPost[]): any[] => {
    const trends: { [key: string]: { [key: string]: number } } = {}
    const allDates = new Set<string>()
    
    // First, collect all dates
    posts.forEach(post => {
      if (!post.sentiment || !post.businessName) return
      
      const date = new Date(post.created_utc * 1000)
      const dateKey = timeFrame === 'daily' 
        ? date.toLocaleDateString('en-US')
        : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      
      allDates.add(dateKey)
    })

    // Initialize all dates with default values
    Array.from(allDates).forEach(dateKey => {
      trends[dateKey] = {}
      businesses.forEach(business => {
        trends[dateKey][`${business}_positive`] = 0
        trends[dateKey][`${business}_neutral`] = 0
        trends[dateKey][`${business}_negative`] = 0
        trends[dateKey][`${business}_total`] = 0
      })
    })
    
    // Add actual data
    posts.forEach(post => {
      if (!post.sentiment || !post.businessName) return
      
      const date = new Date(post.created_utc * 1000)
      const dateKey = timeFrame === 'daily' 
        ? date.toLocaleDateString('en-US')
        : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      
      trends[dateKey][`${post.businessName}_${post.sentiment.sentiment}`]++
      trends[dateKey][`${post.businessName}_total`]++
    })

    // Normalize percentages and ensure continuous data
    return Object.entries(trends)
      .map(([date, data]) => {
        const result: any = { date }
        businesses.forEach(business => {
          const total = data[`${business}_total`]
          if (total > 0) {
            const positive = (data[`${business}_positive`] / total) * 100
            const negative = (data[`${business}_negative`] / total) * 100
            const neutral = (data[`${business}_neutral`] / total) * 100
            result[`${business}_positive`] = Math.round(positive)
            result[`${business}_negative`] = Math.round(negative)
            result[`${business}_neutral`] = Math.round(neutral)
          } else {
            // Default values when no data (gray scale)
            result[`${business}_positive`] = 33
            result[`${business}_negative`] = 33
            result[`${business}_neutral`] = 34
            result[`${business}_no_data`] = true
          }
        })
        return result
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const handleAnalyze = async () => {
    if (!businessName.trim()) {
      setError('Please enter a business name')
      return
    }

    // Basic validation for business name
    if (!/^[a-zA-Z0-9\s\-&.]+$/.test(businessName)) {
      setError('Please enter a valid business name (letters, numbers, spaces, and basic punctuation only)')
      return
    }

    setLoading(true)
    setError('')
    
    if (!comparisonMode) {
      setDiscussions([])
      setSentimentTrends([])
      setBusinesses([])
    }
    
    try {
      const response = await fetch('/api/reddit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          businessName: businessName.trim(),
          limit: 50 // Limit to 50 posts
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch discussions')
      }

      if (data.discussions.length === 0) {
        setError(`No business-related discussions found for "${businessName}"`)
        return
      }

      const analyzedPosts = analyzePosts(data.discussions).map(post => ({
        ...post,
        businessName
      }))

      if (comparisonMode) {
        // Prevent adding the same business twice
        if (businesses.includes(businessName)) {
          setError(`${businessName} is already being analyzed`)
          return
        }
        setDiscussions(prev => [...prev, ...analyzedPosts])
        setBusinesses(prev => {
          const newBusinesses = Array.from(new Set([...prev, businessName]))
          return newBusinesses
        })
      } else {
        setDiscussions(analyzedPosts)
        setBusinesses([businessName])
      }
      
      setSentimentTrends(calculateTrends(analyzedPosts))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch discussions')
    } finally {
      setLoading(false)
    }
  }

  const handleCompare = async () => {
    if (!comparedBusinessName.trim()) {
      setError('Please enter a business name to compare')
      return
    }

    if (businesses.length >= 2) {
      setError('You can only compare two businesses at a time')
      return
    }

    // Basic validation for business name
    if (!/^[a-zA-Z0-9\s\-&.]+$/.test(comparedBusinessName)) {
      setError('Please enter a valid business name (letters, numbers, spaces, and basic punctuation only)')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/reddit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          businessName: comparedBusinessName.trim(),
          limit: 50
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch discussions')
      }

      if (data.discussions.length === 0) {
        setError(`No business-related discussions found for "${comparedBusinessName}"`)
        return
      }

      const analyzedPosts = analyzePosts(data.discussions).map(post => ({
        ...post,
        businessName: comparedBusinessName
      }))

      // Prevent adding the same business twice
      if (businesses.includes(comparedBusinessName)) {
        setError(`${comparedBusinessName} is already being analyzed`)
        return
      }

      setDiscussions(prev => [...prev, ...analyzedPosts])
      setBusinesses(prev => {
        const newBusinesses = Array.from(new Set([...prev, comparedBusinessName]))
        return newBusinesses
      })
      setComparedBusinessName('')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch discussions')
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getSentimentStats = () => {
    const stats = {
      positive: 0,
      neutral: 0,
      negative: 0,
      total: filteredDiscussions.length
    }

    filteredDiscussions.forEach(post => {
      if (post.sentiment) {
        stats[post.sentiment.sentiment]++
      }
    })

    // Normalize percentages to ensure they sum to 100%
    const total = stats.positive + stats.neutral + stats.negative
    if (total > 0) {
      const normalizer = 100 / total
      stats.positive = Math.round(stats.positive * normalizer)
      stats.negative = Math.round(stats.negative * normalizer)
      stats.neutral = 100 - stats.positive - stats.negative // Ensure they sum to 100
    }

    return stats
  }

  const handleSubredditToggle = (subreddit: string) => {
    setSelectedSubreddits(prev => 
      prev.includes(subreddit)
        ? prev.filter(s => s !== subreddit)
        : [...prev, subreddit]
    )
  }

  const handleSentimentToggle = (sentiment: string) => {
    setSelectedSentiments(prev =>
      prev.includes(sentiment)
        ? prev.filter(s => s !== sentiment)
        : [...prev, sentiment]
    )
  }

  const getSubredditButtonStyle = (subreddit: string) => {
    const isSelected = selectedSubreddits.includes(subreddit)
    const colors = [
      { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
      { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
      { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
      { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
      { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
      { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
      { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },
      { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
      { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300' },
    ]
    const colorIndex = subreddits.indexOf(subreddit) % colors.length
    const color = colors[colorIndex]
    
    return isSelected
      ? `${color.bg} ${color.text} ${color.border} border-2`
      : 'border-gray-200 text-gray-600 hover:border-primary'
  }

  const getSentimentButtonStyle = (sentiment: string) => {
    const isSelected = selectedSentiments.includes(sentiment)
    const colors = {
      positive: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      negative: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
      neutral: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' }
    }
    const color = colors[sentiment as keyof typeof colors]
    
    return isSelected
      ? `${color.bg} ${color.text} ${color.border} border-2`
      : 'border-gray-200 text-gray-600 hover:border-primary'
  }

  const getButtonStyle = (isSelected: boolean, index: number = 0) => {
    const baseStyle = 'px-3 py-1 text-sm rounded-full border transition-colors'
    return `${baseStyle} ${
      isSelected
        ? getButtonColors(index)
        : 'border-gray-200 text-gray-600 hover:border-primary'
    }`
  }

  const renderChart = () => {
    const trends = calculateTrends(filteredDiscussions)
    const businessColors = [
      {
        positive: { normal: '#3B82F6', muted: '#93C5FD' },
        neutral: { normal: '#6B7280', muted: '#D1D5DB' },
        negative: { normal: '#EF4444', muted: '#FCA5A5' }
      },
      {
        positive: { normal: '#10B981', muted: '#6EE7B7' },
        neutral: { normal: '#6B7280', muted: '#D1D5DB' },
        negative: { normal: '#F43F5E', muted: '#FDA4AF' }
      }
    ]

    const getLineColor = (businessIndex: number, sentiment: string, noData: boolean) => {
      const colors = businessColors[businessIndex]
      const sentimentColors = colors[sentiment as keyof typeof colors]
      return noData ? sentimentColors.muted : sentimentColors.normal
    }

    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              formatter={(value: number, name: string) => {
                const [business, sentiment] = name.split(' (')
                return [`${value}%`, `${business} ${sentiment.slice(0, -1)}`]
              }}
            />
            <Legend />
            {businesses.map((business, businessIndex) => (
              ['positive', 'negative', 'neutral'].map((sentiment) => (
                <Line
                  key={`${business}_${sentiment}`}
                  type="monotone"
                  dataKey={`${business}_${sentiment}`}
                  stroke={getLineColor(businessIndex, sentiment, trends.some(t => t[`${business}_no_data`]))}
                  name={`${business} (${sentiment})`}
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                  connectNulls={true}
                />
              ))
            ))}
          </LineChart>
        </ResponsiveContainer>
      )
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={trends}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip 
            formatter={(value: number, name: string) => {
              const [business, sentiment] = name.split(' (')
              return [`${value}%`, `${business} ${sentiment.slice(0, -1)}`]
            }}
          />
          <Legend />
          {businesses.map((business, businessIndex) => (
            ['positive', 'negative', 'neutral'].map((sentiment) => (
              <Bar
                key={`${business}_${sentiment}`}
                dataKey={`${business}_${sentiment}`}
                fill={getLineColor(businessIndex, sentiment, trends.some(t => t[`${business}_no_data`]))}
                name={`${business} (${sentiment})`}
                stackId={business}
              />
            ))
          ))}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
            Analyze Business Sentiment
          </h2>
          <div className="flex gap-4">
            {comparisonMode ? (
              <>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter first business name"
                    className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white"
                    disabled={businesses.length > 0}
                  />
                  <input
                    type="text"
                    value={comparedBusinessName}
                    onChange={(e) => setComparedBusinessName(e.target.value)}
                    placeholder="Enter second business name"
                    className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setComparisonMode(false)
                      setBusinesses([])
                      setDiscussions([])
                      setBusinessName('')
                      setComparedBusinessName('')
                    }}
                    className={getButtonStyle(false, 4)}
                  >
                    Exit Compare
                  </button>
                  <button
                    onClick={businesses.length === 0 ? handleAnalyze : handleCompare}
                    disabled={loading || (!businessName && businesses.length === 0) || (!comparedBusinessName && businesses.length > 0) || businesses.length >= 2}
                    className="px-8 py-3 bg-primary text-black border border-gray-200 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Analyzing...' : businesses.length === 0 ? 'Compare' : 'Add Business'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter business name"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setComparisonMode(true)
                      setBusinessName('')
                    }}
                    className={getButtonStyle(false)}
                  >
                    Compare Mode
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !businessName}
                    className="px-8 py-3 bg-primary text-black border border-gray-200 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Analyzing...' : 'Analyze'}
                  </button>
                </div>
              </>
            )}
          </div>
          {error && (
            <p className="mt-4 text-red-500 text-center">{error}</p>
          )}
        </div>
      </div>

      {discussions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-100">
            <div className="flex gap-4 p-4">
              <button
                onClick={() => setActiveTab('discussions')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'discussions'
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Discussions
              </button>
              <button
                onClick={() => setActiveTab('trends')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'trends'
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Trends
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6 space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Subreddits</h3>
                  <div className="flex flex-wrap gap-2">
                    {subreddits.map(subreddit => (
                      <button
                        key={subreddit}
                        onClick={() => handleSubredditToggle(subreddit)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${getSubredditButtonStyle(subreddit)}`}
                      >
                        {subreddit}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Sentiment</h3>
                  <div className="flex gap-2">
                    {['positive', 'neutral', 'negative'].map((sentiment) => (
                      <button
                        key={sentiment}
                        onClick={() => handleSentimentToggle(sentiment)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${getSentimentButtonStyle(sentiment)}`}
                      >
                        {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {activeTab === 'discussions' && (
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {Object.entries(getSentimentStats()).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-500">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                      <div className="text-2xl font-semibold mt-1 text-gray-900">
                        {key === 'total' ? value : `${((value )).toFixed(1)}%`}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredDiscussions.map((post) => (
                    <div
                      key={post.id}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-medium flex-1">
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {post.title}
                          </a>
                        </h3>
                        {post.sentiment && (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getSentimentColor(post.sentiment.sentiment)}`}>
                            {post.sentiment.sentiment.charAt(0).toUpperCase() + post.sentiment.sentiment.slice(1)}
                            {' '}({(post.sentiment.score.compound ).toFixed(1)}%)
                          </span>
                        )}
                      </div>
                      {post.selftext && (
                        <p className="text-gray-600 text-sm mt-2">
                          {post.selftext.length > 150
                            ? `${post.selftext.substring(0, 150)}...`
                            : post.selftext}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">{post.subreddit}</span>
                        <span>Score: {post.score}</span>
                        <span>Comments: {post.num_comments}</span>
                        <span>{new Date(post.created_utc * 1000).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'trends' && (
              <div className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">Time Frame</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTimeFrame('daily')}
                        className={getButtonStyle(timeFrame === 'daily', 0)}
                      >
                        Daily
                      </button>
                      <button
                        onClick={() => setTimeFrame('monthly')}
                        className={getButtonStyle(timeFrame === 'monthly', 1)}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">Chart Type</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setChartType('line')}
                        className={getButtonStyle(chartType === 'line', 2)}
                      >
                        Line
                      </button>
                      <button
                        onClick={() => setChartType('bar')}
                        className={getButtonStyle(chartType === 'bar', 3)}
                      >
                        Bar
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  {renderChart()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 