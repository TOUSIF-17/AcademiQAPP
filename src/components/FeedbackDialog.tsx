'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Star, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'

interface FeedbackDialogProps {
  publicationId: string
  facultyId: string
  publicationTitle: string
  facultyName: string
}

export default function FeedbackDialog({ 
  publicationId, 
  facultyId, 
  publicationTitle, 
  facultyName 
}: FeedbackDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [feedback, setFeedback] = useState({
    content: '',
    studentName: '',
    studentEmail: '',
    rating: 5
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...feedback,
          facultyId,
          publicationId
        }),
      })

      if (response.ok) {
        setSuccess('Thank you for your feedback!')
        setFeedback({
          content: '',
          studentName: '',
          studentEmail: '',
          rating: 5
        })
        setTimeout(() => {
          setOpen(false)
          setSuccess('')
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to submit feedback')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Provide Feedback</DialogTitle>
          <DialogDescription>
            Share your thoughts on "{publicationTitle}" by {facultyName}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= feedback.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm text-slate-600 ml-2">
                {feedback.rating}/5
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your Feedback *</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts about this research..."
              value={feedback.content}
              onChange={(e) => setFeedback(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Your Name</Label>
              <Input
                id="studentName"
                type="text"
                placeholder="Enter your name"
                value={feedback.studentName}
                onChange={(e) => setFeedback(prev => ({ ...prev, studentName: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="studentEmail">Your Email</Label>
              <Input
                id="studentEmail"
                type="email"
                placeholder="Enter your email"
                value={feedback.studentEmail}
                onChange={(e) => setFeedback(prev => ({ ...prev, studentEmail: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}