'use client';
import React from 'react';


import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, TrendingUp, Award, Medal, Trophy } from 'lucide-react';
export default function Rankings() {
  const [user, setUser] = useState(null);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rankingType, setRankingType] = useState('overall');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      window.location.href = '/auth/signin';
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchRankings();
  }, [rankingType, departmentFilter]);
  const fetchRankings = async () => {
    try {
      const response = await fetch(`/api/rankings?type=${rankingType}&department=${departmentFilter}`);
      if (response.ok) {
        const data = await response.json();
        setFaculty(data);
      }
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };
  const getRankIcon = rank => {
    if (rank === 1) return /*#__PURE__*/React.createElement(Trophy, {
      className: "h-6 w-6 text-yellow-500"
    });
    if (rank === 2) return /*#__PURE__*/React.createElement(Medal, {
      className: "h-6 w-6 text-gray-400"
    });
    if (rank === 3) return /*#__PURE__*/React.createElement(Award, {
      className: "h-6 w-6 text-amber-600"
    });
    return /*#__PURE__*/React.createElement("span", {
      className: "text-lg font-bold text-slate-600"
    }, "#", rank);
  };
  const getRankBadgeColor = rank => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (rank === 2) return 'bg-gray-100 text-gray-800 border-gray-200';
    if (rank === 3) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };
  const getDepartments = () => {
    const depts = Array.from(new Set(faculty.map(f => f.department).filter(Boolean)));
    return depts;
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
    }, "Loading rankings...")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gray-50"
  }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto px-4 py-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-8"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold text-slate-900 mb-2"
  }, "Faculty Rankings"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-600"
  }, "Recognizing excellence in research and academic contributions")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row gap-4 mb-8 justify-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full md:w-64"
  }, /*#__PURE__*/React.createElement(Select, {
    value: rankingType,
    onValueChange: setRankingType
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Ranking Type"
  })), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "overall"
  }, "Overall Score"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "publications"
  }, "Most Publications"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "citations"
  }, "Most Citations"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "impact"
  }, "Impact Factor")))), /*#__PURE__*/React.createElement("div", {
    className: "w-full md:w-64"
  }, /*#__PURE__*/React.createElement(Select, {
    value: departmentFilter,
    onValueChange: setDepartmentFilter
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Department"
  })), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "all"
  }, "All Departments"), getDepartments().map(dept => /*#__PURE__*/React.createElement(SelectItem, {
    key: dept,
    value: dept
  }, dept)))))), faculty.length >= 3 && /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-4 right-4"
  }, getRankIcon(2)), /*#__PURE__*/React.createElement(CardHeader, {
    className: "text-center"
  }, /*#__PURE__*/React.createElement(Avatar, {
    className: "h-20 w-20 mx-auto mb-4"
  }, /*#__PURE__*/React.createElement(AvatarImage, {
    src: ""
  }), /*#__PURE__*/React.createElement(AvatarFallback, {
    className: "text-2xl"
  }, faculty[1]?.name?.charAt(0) || 'U')), /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-xl"
  }, faculty[1]?.name), /*#__PURE__*/React.createElement(CardDescription, null, faculty[1]?.designation), /*#__PURE__*/React.createElement(Badge, {
    className: getRankBadgeColor(2)
  }, "2nd Place")), /*#__PURE__*/React.createElement(CardContent, {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold text-slate-900 mb-2"
  }, faculty[1]?.score.toFixed(1), " pts"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-slate-600 space-y-1"
  }, /*#__PURE__*/React.createElement("div", null, faculty[1]?.publications.length, " publications"), /*#__PURE__*/React.createElement("div", null, faculty[1]?.citations, " citations")))), /*#__PURE__*/React.createElement(Card, {
    className: "relative overflow-hidden border-2 border-yellow-300 shadow-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-4 right-4"
  }, getRankIcon(1)), /*#__PURE__*/React.createElement(CardHeader, {
    className: "text-center"
  }, /*#__PURE__*/React.createElement(Avatar, {
    className: "h-24 w-24 mx-auto mb-4"
  }, /*#__PURE__*/React.createElement(AvatarImage, {
    src: ""
  }), /*#__PURE__*/React.createElement(AvatarFallback, {
    className: "text-3xl bg-yellow-100 text-yellow-800"
  }, faculty[0]?.name?.charAt(0) || 'U')), /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-2xl"
  }, faculty[0]?.name), /*#__PURE__*/React.createElement(CardDescription, null, faculty[0]?.designation), /*#__PURE__*/React.createElement(Badge, {
    className: "bg-yellow-100 text-yellow-800 border-yellow-200"
  }, "\uD83C\uDFC6 1st Place")), /*#__PURE__*/React.createElement(CardContent, {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-3xl font-bold text-yellow-600 mb-2"
  }, faculty[0]?.score.toFixed(1), " pts"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-slate-600 space-y-1"
  }, /*#__PURE__*/React.createElement("div", null, faculty[0]?.publications.length, " publications"), /*#__PURE__*/React.createElement("div", null, faculty[0]?.citations, " citations")))), /*#__PURE__*/React.createElement(Card, {
    className: "relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-4 right-4"
  }, getRankIcon(3)), /*#__PURE__*/React.createElement(CardHeader, {
    className: "text-center"
  }, /*#__PURE__*/React.createElement(Avatar, {
    className: "h-20 w-20 mx-auto mb-4"
  }, /*#__PURE__*/React.createElement(AvatarImage, {
    src: ""
  }), /*#__PURE__*/React.createElement(AvatarFallback, {
    className: "text-2xl"
  }, faculty[2]?.name?.charAt(0) || 'U')), /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-xl"
  }, faculty[2]?.name), /*#__PURE__*/React.createElement(CardDescription, null, faculty[2]?.designation), /*#__PURE__*/React.createElement(Badge, {
    className: getRankBadgeColor(3)
  }, "3rd Place")), /*#__PURE__*/React.createElement(CardContent, {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold text-slate-900 mb-2"
  }, faculty[2]?.score.toFixed(1), " pts"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-slate-600 space-y-1"
  }, /*#__PURE__*/React.createElement("div", null, faculty[2]?.publications.length, " publications"), /*#__PURE__*/React.createElement("div", null, faculty[2]?.citations, " citations"))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Complete Rankings"), /*#__PURE__*/React.createElement(CardDescription, null, rankingType === 'overall' && 'Overall academic score based on publications, citations, and impact', rankingType === 'publications' && 'Ranked by total number of publications', rankingType === 'citations' && 'Ranked by total citation count', rankingType === 'impact' && 'Ranked by average citations per publication')), /*#__PURE__*/React.createElement(CardContent, null, faculty.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-8"
  }, /*#__PURE__*/React.createElement(TrendingUp, {
    className: "h-16 w-16 text-slate-300 mx-auto mb-4"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-semibold text-slate-900 mb-2"
  }, "No rankings available"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-600"
  }, "Check back later for updated rankings.")) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, faculty.map((facultyMember, index) => /*#__PURE__*/React.createElement("div", {
    key: facultyMember.id,
    className: "flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center w-12 h-12"
  }, index < 3 ? getRankIcon(index + 1) : /*#__PURE__*/React.createElement("span", {
    className: "text-lg font-bold text-slate-600"
  }, "#", index + 1)), /*#__PURE__*/React.createElement(Avatar, {
    className: "h-12 w-12"
  }, /*#__PURE__*/React.createElement(AvatarImage, {
    src: ""
  }), /*#__PURE__*/React.createElement(AvatarFallback, null, facultyMember.name?.charAt(0) || 'U')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-semibold text-slate-900"
  }, facultyMember.name), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-600"
  }, facultyMember.designation, facultyMember.department && ` • ${facultyMember.department}`))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-lg text-slate-900"
  }, facultyMember.score.toFixed(1), " pts"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-slate-600"
  }, facultyMember.publications.length, " pubs \u2022 ", facultyMember.citations, " cites")), /*#__PURE__*/React.createElement(Link, {
    href: `/faculty/${facultyMember.id}`
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm"
  }, "View Profile")))))))), /*#__PURE__*/React.createElement(Card, {
    className: "mt-8"
  }, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Ranking Methodology")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-2 gap-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-semibold mb-2"
  }, "Overall Score Calculation"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-600 mb-2"
  }, "The overall score is calculated using a weighted formula:"), /*#__PURE__*/React.createElement("ul", {
    className: "text-sm text-slate-600 space-y-1"
  }, /*#__PURE__*/React.createElement("li", null, "\u2022 Publications: 40% weight"), /*#__PURE__*/React.createElement("li", null, "\u2022 Citations: 40% weight"), /*#__PURE__*/React.createElement("li", null, "\u2022 Impact Factor: 20% weight"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-semibold mb-2"
  }, "Impact Factor"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-600"
  }, "Calculated as average citations per publication, with bonuses for recent high-impact work.")))))));
}

