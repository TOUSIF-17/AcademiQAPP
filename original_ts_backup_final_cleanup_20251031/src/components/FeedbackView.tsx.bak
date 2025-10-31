'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageSquare, ThumbsUp, ThumbsDown, Star, Loader2 } from 'lucide-react'

interface Feedback {
  id: string
  content: string
  sentiment: string
  sentimentScore: number
  studentName?: string
  createdAt: string
}

interface FeedbackViewProps {
  publicationId: string
  facultyId: string
}

export default function FeedbackView({ publicationId, facultyId }: FeedbackViewProps) {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeedback()
  }, [publicationId, facultyId])

  const fetchFeedback = async () => {
    try {
      const params = new URLSearchParams()
      if (publicationId) params.append('publicationId', publicationId)
      if (facultyId) params.append('facultyId', facultyId)

      const response = await fetch(`/api/feedback?${params}`)
      if (response.ok) {
        const data = await response.json()
        setFeedback(data)
      }
    } catch (error) {
      console.error('Error fetching feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="h-4 w-4 text-green-600" />
      case 'negative':
        return <ThumbsDown className="h-4 w-4 text-red-600" />
      default:
        return <Star className="h-4 w-4 text-yellow-600" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading feedback...</span>
      </div>
    )
  }

  if (feedback.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No feedback yet</h3>
        <p className="text-slate-600">Be the first to share your thoughts on this research.</p>
      </div>
    )
  }

  const sentimentStats = feedback.reduce((acc, item) => {
    acc[item.sentiment] = (acc[item.sentiment] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Feedback Summary</CardTitle>
          <CardDescription>Overall sentiment analysis from {feedback.length} reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{sentimentStats.positive || 0}</div>
              <div className="text-sm text-slate-600">Positive</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{sentimentStats.neutral || 0}</div>
              <div className="text-sm text-slate-600">Neutral</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{sentimentStats.negative || 0}</div>
              <div className="text-sm text-slate-600">Negative</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Feedback */}
      <div className="space-y-4">
        {feedback.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {item.studentName?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-sm">
                      {item.studentName || 'Anonymous'}
                    </h4>
                    <p className="text-xs text-slate-600">{formatDate(item.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getSentimentColor(item.sentiment)} variant="outline">
                    {getSentimentIcon(item.sentiment)}
                    <span className="ml-1 capitalize">{item.sentiment}</span>
                  </Badge>
                  {item.sentimentScore && (
                    <span className="text-xs text-slate-500">
                      {item.sentimentScore.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-slate-700 leading-relaxed">{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}