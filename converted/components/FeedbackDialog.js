'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Star, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
export default function FeedbackDialog({
  publicationId,
  facultyId,
  publicationTitle,
  facultyName
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [feedback, setFeedback] = useState({
    content: '',
    studentName: '',
    studentEmail: '',
    rating: 5
  });
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...feedback,
          facultyId,
          publicationId
        })
      });
      if (response.ok) {
        setSuccess('Thank you for your feedback!');
        setFeedback({
          content: '',
          studentName: '',
          studentEmail: '',
          rating: 5
        });
        setTimeout(() => {
          setOpen(false);
          setSuccess('');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit feedback');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const getSentimentIcon = sentiment => {
    switch (sentiment) {
      case 'positive':
        return /*#__PURE__*/React.createElement(ThumbsUp, {
          className: "h-4 w-4 text-green-600"
        });
      case 'negative':
        return /*#__PURE__*/React.createElement(ThumbsDown, {
          className: "h-4 w-4 text-red-600"
        });
      default:
        return /*#__PURE__*/React.createElement(Star, {
          className: "h-4 w-4 text-yellow-600"
        });
    }
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    onOpenChange: setOpen
  }, /*#__PURE__*/React.createElement(DialogTrigger, {
    asChild: true
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm"
  }, /*#__PURE__*/React.createElement(MessageSquare, {
    className: "h-4 w-4 mr-2"
  }), "Feedback")), /*#__PURE__*/React.createElement(DialogContent, {
    className: "max-w-md"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, null, "Provide Feedback"), /*#__PURE__*/React.createElement(DialogDescription, null, "Share your thoughts on \"", publicationTitle, "\" by ", facultyName)), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, error && /*#__PURE__*/React.createElement(Alert, {
    variant: "destructive"
  }, /*#__PURE__*/React.createElement(AlertDescription, null, error)), success && /*#__PURE__*/React.createElement(Alert, null, /*#__PURE__*/React.createElement(AlertDescription, null, success)), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "rating"
  }, "Rating"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, [1, 2, 3, 4, 5].map(star => /*#__PURE__*/React.createElement("button", {
    key: star,
    type: "button",
    onClick: () => setFeedback(prev => ({
      ...prev,
      rating: star
    })),
    className: "focus:outline-none"
  }, /*#__PURE__*/React.createElement(Star, {
    className: `h-6 w-6 ${star <= feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`
  }))), /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-slate-600 ml-2"
  }, feedback.rating, "/5"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "content"
  }, "Your Feedback *"), /*#__PURE__*/React.createElement(Textarea, {
    id: "content",
    placeholder: "Share your thoughts about this research...",
    value: feedback.content,
    onChange: e => setFeedback(prev => ({
      ...prev,
      content: e.target.value
    })),
    rows: 4,
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "studentName"
  }, "Your Name"), /*#__PURE__*/React.createElement(Input, {
    id: "studentName",
    type: "text",
    placeholder: "Enter your name",
    value: feedback.studentName,
    onChange: e => setFeedback(prev => ({
      ...prev,
      studentName: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "studentEmail"
  }, "Your Email"), /*#__PURE__*/React.createElement(Input, {
    id: "studentEmail",
    type: "email",
    placeholder: "Enter your email",
    value: feedback.studentEmail,
    onChange: e => setFeedback(prev => ({
      ...prev,
      studentEmail: e.target.value
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end space-x-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: () => setOpen(false)
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    disabled: loading
  }, loading ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Loader2, {
    className: "h-4 w-4 mr-2 animate-spin"
  }), "Submitting...") : 'Submit Feedback')))));
}
