'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, ThumbsUp, ThumbsDown, Star, Loader2 } from 'lucide-react';
export default function FeedbackView({
  publicationId,
  facultyId
}) {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchFeedback();
  }, [publicationId, facultyId]);
  const fetchFeedback = async () => {
    try {
      const params = new URLSearchParams();
      if (publicationId) params.append('publicationId', publicationId);
      if (facultyId) params.append('facultyId', facultyId);
      const response = await fetch(`/api/feedback?${params}`);
      if (response.ok) {
        const data = await response.json();
        setFeedback(data);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
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
  const getSentimentColor = sentiment => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-center py-8"
    }, /*#__PURE__*/React.createElement(Loader2, {
      className: "h-6 w-6 animate-spin mr-2"
    }), /*#__PURE__*/React.createElement("span", null, "Loading feedback..."));
  }
  if (feedback.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "text-center py-8"
    }, /*#__PURE__*/React.createElement(MessageSquare, {
      className: "h-12 w-12 text-slate-300 mx-auto mb-4"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "text-lg font-semibold text-slate-900 mb-2"
    }, "No feedback yet"), /*#__PURE__*/React.createElement("p", {
      className: "text-slate-600"
    }, "Be the first to share your thoughts on this research."));
  }
  const sentimentStats = feedback.reduce((acc, item) => {
    acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
    return acc;
  }, {});
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-lg"
  }, "Feedback Summary"), /*#__PURE__*/React.createElement(CardDescription, null, "Overall sentiment analysis from ", feedback.length, " reviews")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-4 text-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold text-green-600"
  }, sentimentStats.positive || 0), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-slate-600"
  }, "Positive")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold text-yellow-600"
  }, sentimentStats.neutral || 0), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-slate-600"
  }, "Neutral")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold text-red-600"
  }, sentimentStats.negative || 0), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-slate-600"
  }, "Negative"))))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, feedback.map(item => /*#__PURE__*/React.createElement(Card, {
    key: item.id
  }, /*#__PURE__*/React.createElement(CardHeader, {
    className: "pb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement(Avatar, {
    className: "h-8 w-8"
  }, /*#__PURE__*/React.createElement(AvatarImage, {
    src: ""
  }), /*#__PURE__*/React.createElement(AvatarFallback, null, item.studentName?.charAt(0) || 'A')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-semibold text-sm"
  }, item.studentName || 'Anonymous'), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-600"
  }, formatDate(item.createdAt)))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(Badge, {
    className: getSentimentColor(item.sentiment),
    variant: "outline"
  }, getSentimentIcon(item.sentiment), /*#__PURE__*/React.createElement("span", {
    className: "ml-1 capitalize"
  }, item.sentiment)), item.sentimentScore && /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-slate-500"
  }, item.sentimentScore.toFixed(2))))), /*#__PURE__*/React.createElement(CardContent, {
    className: "pt-0"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-slate-700 leading-relaxed"
  }, item.content))))));
}
