'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Brain, User, TrendingUp, BarChart3, LogOut, BookOpen, Mail, Calendar, ArrowLeft } from 'lucide-react';
export default function FacultyProfile() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      window.location.href = '/auth/signin';
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    if (params.id) {
      fetchFaculty(params.id);
    }
  }, [params.id]);
  const fetchFaculty = async facultyId => {
    try {
      const response = await fetch(`/api/faculty/${facultyId}`);
      if (response.ok) {
        const data = await response.json();
        setFaculty(data);
      } else {
        router.push('/faculty');
      }
    } catch (error) {
      console.error('Error fetching faculty:', error);
      router.push('/faculty');
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen bg-slate-50 flex items-center justify-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement(Brain, {
      className: "h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-slate-600"
    }, "Loading faculty profile...")));
  }
  if (!faculty) {
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen bg-slate-50 flex items-center justify-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement(User, {
      className: "h-16 w-16 text-slate-300 mx-auto mb-4"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "text-xl font-semibold text-slate-900 mb-2"
    }, "Faculty not found"), /*#__PURE__*/React.createElement(Link, {
      href: "/faculty"
    }, /*#__PURE__*/React.createElement(Button, null, "Back to Faculty Directory"))));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-slate-50"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "border-b bg-white sticky top-0 z-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto px-4 py-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-8"
  }, /*#__PURE__*/React.createElement(Link, {
    href: "/feed",
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(Brain, {
    className: "h-8 w-8 text-blue-600"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-2xl font-bold text-slate-900"
  }, "AcademiQ")), /*#__PURE__*/React.createElement("div", {
    className: "hidden md:flex items-center space-x-6"
  }, /*#__PURE__*/React.createElement(Link, {
    href: "/faculty",
    className: "flex items-center space-x-2 text-blue-600"
  }, /*#__PURE__*/React.createElement(User, {
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Faculty")), /*#__PURE__*/React.createElement(Link, {
    href: "/rankings",
    className: "flex items-center space-x-2 text-slate-600 hover:text-blue-600"
  }, /*#__PURE__*/React.createElement(TrendingUp, {
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Rankings")), /*#__PURE__*/React.createElement(Link, {
    href: "/analytics",
    className: "flex items-center space-x-2 text-slate-600 hover:text-blue-600"
  }, /*#__PURE__*/React.createElement(BarChart3, {
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Analytics")), /*#__PURE__*/React.createElement(Link, {
    href: "/profile",
    className: "flex items-center space-x-2 text-slate-600 hover:text-blue-600"
  }, /*#__PURE__*/React.createElement(User, {
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Profile")))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    onClick: handleLogout
  }, /*#__PURE__*/React.createElement(LogOut, {
    className: "h-4 w-4 mr-2"
  }), "Logout"))))), /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto px-4 py-8"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    className: "mb-6",
    onClick: () => router.back()
  }, /*#__PURE__*/React.createElement(ArrowLeft, {
    className: "h-4 w-4 mr-2"
  }), "Back to Faculty"), /*#__PURE__*/React.createElement(Card, {
    className: "mb-8"
  }, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4"
  }, /*#__PURE__*/React.createElement(Avatar, {
    className: "h-20 w-20"
  }, /*#__PURE__*/React.createElement(AvatarImage, {
    src: ""
  }), /*#__PURE__*/React.createElement(AvatarFallback, {
    className: "text-2xl"
  }, faculty.name?.charAt(0) || 'U')), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-3xl mb-2"
  }, faculty.name), /*#__PURE__*/React.createElement(CardDescription, {
    className: "text-lg mb-3"
  }, faculty.designation, faculty.department && ` • ${faculty.department}`), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4"
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "secondary"
  }, faculty.role), faculty.specialization && /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, faculty.specialization), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4 text-sm text-slate-600"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(BookOpen, {
    className: "h-4 w-4 mr-1"
  }), faculty.publications.length, " publications"), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(TrendingUp, {
    className: "h-4 w-4 mr-1"
  }), faculty.citations, " citations")))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col space-y-2"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline"
  }, /*#__PURE__*/React.createElement(Mail, {
    className: "h-4 w-4 mr-2"
  }), "Contact")))), faculty.bio && /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("h3", {
    className: "font-semibold text-slate-900 mb-2"
  }, "About"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-700 leading-relaxed"
  }, faculty.bio))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-bold text-slate-900 mb-6"
  }, "Publications"), faculty.publications.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-16"
  }, /*#__PURE__*/React.createElement(BookOpen, {
    className: "h-16 w-16 text-slate-300 mx-auto mb-4"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-semibold text-slate-900 mb-2"
  }, "No publications yet"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-600"
  }, "This faculty member hasn't added any publications yet.")) : /*#__PURE__*/React.createElement("div", {
    className: "grid gap-6"
  }, faculty.publications.map(publication => /*#__PURE__*/React.createElement(Card, {
    key: publication.id,
    className: "hover:shadow-lg transition-shadow"
  }, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-xl mb-2"
  }, publication.title), /*#__PURE__*/React.createElement(CardDescription, {
    className: "flex items-center space-x-2 text-sm"
  }, publication.authors && /*#__PURE__*/React.createElement("span", null, publication.authors), publication.journal && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "\u2022"), /*#__PURE__*/React.createElement("span", null, publication.journal)), publication.year && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "\u2022"), /*#__PURE__*/React.createElement("span", null, publication.year)), /*#__PURE__*/React.createElement("span", null, "\u2022"), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(Calendar, {
    className: "h-3 w-3 mr-1"
  }), new Date(publication.createdAt).toLocaleDateString()))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, publication.citations, " citations")))), /*#__PURE__*/React.createElement(CardContent, null, publication.hybridSummary && /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-semibold text-slate-900 mb-2"
  }, "AI Summary"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-700 leading-relaxed"
  }, publication.hybridSummary)), publication.abstract && /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-semibold text-slate-900 mb-2"
  }, "Abstract"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-700 leading-relaxed line-clamp-3"
  }, publication.abstract)), publication.doi && /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-slate-600"
  }, /*#__PURE__*/React.createElement("strong", null, "DOI:"), " ", publication.doi)))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-6 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-3xl font-bold text-blue-600 mb-2"
  }, faculty.publications.length), /*#__PURE__*/React.createElement("div", {
    className: "text-slate-600"
  }, "Total Publications"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-6 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-3xl font-bold text-green-600 mb-2"
  }, faculty.citations), /*#__PURE__*/React.createElement("div", {
    className: "text-slate-600"
  }, "Total Citations"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-6 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-3xl font-bold text-purple-600 mb-2"
  }, faculty.publications.length > 0 ? Math.round(faculty.citations / faculty.publications.length) : 0), /*#__PURE__*/React.createElement("div", {
    className: "text-slate-600"
  }, "Avg Citations per Paper"))))));
}