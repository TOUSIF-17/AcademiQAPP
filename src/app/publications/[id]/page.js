'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, BookOpen, TrendingUp, Mail, Building, Download, ArrowLeft, Brain } from 'lucide-react';
export default function PublicationDetailPage() {
  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();
  const router = useRouter();
  const {
    id
  } = params;
  useEffect(() => {
    if (!id) {
      setError('Publication ID is required');
      setLoading(false);
      return;
    }
    fetchPublication();
  }, [id]);
  const fetchPublication = async () => {
    try {
      const response = await fetch(`/api/publications/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPublication(data.publication);
      } else {
        setError('Publication not found');
      }
    } catch (error) {
      setError('Failed to load publication');
    } finally {
      setLoading(false);
    }
  };
  const formatDate = dateString => {
    if (!dateString) return 'Date not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const handleDownload = () => {
    if (publication?.fileName && publication?.filePath) {
      window.open(publication.filePath, '_blank');
    }
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen bg-gray-50"
    }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("div", {
      className: "container mx-auto px-4 py-8"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-center h-64"
    }, /*#__PURE__*/React.createElement("div", {
      className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
    }))));
  }
  if (error || !publication) {
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen bg-gray-50"
    }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("div", {
      className: "container mx-auto px-4 py-8"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center py-12"
    }, /*#__PURE__*/React.createElement(BookOpen, {
      className: "mx-auto h-12 w-12 text-gray-400 mb-4"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "text-lg font-medium text-gray-900 mb-2"
    }, "Publication Not Found"), /*#__PURE__*/React.createElement("p", {
      className: "text-gray-600 mb-4"
    }, error || 'The publication you are looking for does not exist.'), /*#__PURE__*/React.createElement(Button, {
      onClick: () => router.push('/feed')
    }, /*#__PURE__*/React.createElement(ArrowLeft, {
      className: "h-4 w-4 mr-2"
    }), "Back to Feed"))));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gray-50"
  }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto px-4 py-8"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => router.push('/feed'),
    className: "mb-6"
  }, /*#__PURE__*/React.createElement(ArrowLeft, {
    className: "h-4 w-4 mr-2"
  }), "Back to Feed"), /*#__PURE__*/React.createElement(Card, {
    className: "mb-8"
  }, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-2xl mb-4"
  }, publication.title), /*#__PURE__*/React.createElement(CardDescription, {
    className: "text-lg"
  }, "Published in ", /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, publication.journal))), publication.fileName && /*#__PURE__*/React.createElement(Button, {
    onClick: handleDownload,
    variant: "outline"
  }, /*#__PURE__*/React.createElement(Download, {
    className: "h-4 w-4 mr-2"
  }), "Download"))), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-medium mb-2"
  }, "Authors"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, publication.authors.split(',').map((author, index) => /*#__PURE__*/React.createElement(Badge, {
    key: index,
    variant: "outline",
    className: "text-sm"
  }, author.trim())))), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-sm"
  }, /*#__PURE__*/React.createElement(Calendar, {
    className: "h-4 w-4 text-gray-500"
  }), /*#__PURE__*/React.createElement("span", null, formatDate(publication.publicationDate))), publication.volume && /*#__PURE__*/React.createElement("div", {
    className: "text-sm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, "Volume:"), " ", publication.volume), publication.issue && /*#__PURE__*/React.createElement("div", {
    className: "text-sm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, "Issue:"), " ", publication.issue)), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, publication.pages && /*#__PURE__*/React.createElement("div", {
    className: "text-sm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, "Pages:"), " ", publication.pages), publication.doi && /*#__PURE__*/React.createElement("div", {
    className: "text-sm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, "DOI:"), /*#__PURE__*/React.createElement("a", {
    href: `https://doi.org/${publication.doi}`,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "text-blue-600 hover:underline ml-1"
  }, publication.doi)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-sm"
  }, /*#__PURE__*/React.createElement(TrendingUp, {
    className: "h-4 w-4 text-gray-500"
  }), /*#__PURE__*/React.createElement("span", null, publication.citations, " citations")))), publication.keywords && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-medium mb-2"
  }, "Keywords"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, publication.keywords.split(',').map((keyword, index) => /*#__PURE__*/React.createElement(Badge, {
    key: index,
    variant: "outline",
    className: "text-xs bg-blue-50 text-blue-700 border-blue-200"
  }, keyword.trim()))))))), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-3 gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Abstract")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("p", {
    className: "text-gray-700 leading-relaxed"
  }, publication.abstract)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Author")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement(Avatar, {
    className: "h-12 w-12"
  }, /*#__PURE__*/React.createElement(AvatarImage, {
    src: publication.author.profileImage,
    alt: publication.author.name
  }), /*#__PURE__*/React.createElement(AvatarFallback, null, publication.author.name.split(' ').map(n => n[0]).join('').toUpperCase())), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-medium"
  }, publication.author.name), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600"
  }, publication.author.userType))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 text-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-gray-600"
  }, /*#__PURE__*/React.createElement(Mail, {
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, publication.author.email)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-gray-600"
  }, /*#__PURE__*/React.createElement(Building, {
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, publication.author.department)))))))), publication.summary && /*#__PURE__*/React.createElement(Card, {
    className: "mt-8"
  }, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Brain, {
    className: "h-5 w-5 text-blue-600"
  }), "AI Summary")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
    className: "bg-blue-50 p-4 rounded-lg"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-gray-700 leading-relaxed"
  }, publication.summary))))));
}