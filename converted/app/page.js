'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, TrendingUp, Brain, FileText, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/components/logo.png';
export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsAuthenticated(true);
    }
  }, []);
  const features = [{
    icon: Brain,
    title: 'AI-Powered Summarization',
    description: 'Advanced TextRank and BART algorithms generate concise summaries of research publications',
    color: 'text-blue-600'
  }, {
    icon: Users,
    title: 'Faculty Profiles',
    description: 'Comprehensive faculty profiles with publications, citations, and academic achievements',
    color: 'text-green-600'
  }, {
    icon: TrendingUp,
    title: 'Analytics Dashboard',
    description: 'Real-time analytics and insights on research trends and institutional performance',
    color: 'text-purple-600'
  }, {
    icon: FileText,
    title: 'Publication Management',
    description: 'Easy upload and management of research papers with automatic summarization',
    color: 'text-orange-600'
  }, {
    icon: Star,
    title: 'Ranking System',
    description: 'Transparent ranking leaderboard based on publications, citations, and teaching effectiveness',
    color: 'text-yellow-600'
  }, {
    icon: BookOpen,
    title: 'Research Feed',
    description: 'Stay updated with the latest research publications from your institution',
    color: 'text-indigo-600'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100"
  }, /*#__PURE__*/React.createElement("header", {
    className: "border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto px-4 py-4 flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(Image, {
    src: logo,
    alt: "AcademiQ",
    className: "h-16 w-auto",
    priority: true
  })), /*#__PURE__*/React.createElement("nav", {
    className: "hidden md:flex items-center space-x-6"
  }, /*#__PURE__*/React.createElement(Link, {
    href: "#features",
    className: "text-gray-600 hover:text-gray-900 transition-colors"
  }, "Features"), /*#__PURE__*/React.createElement(Link, {
    href: "#about",
    className: "text-gray-600 hover:text-gray-900 transition-colors"
  }, "About")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4"
  }, isAuthenticated ? /*#__PURE__*/React.createElement(Link, {
    href: "/feed"
  }, /*#__PURE__*/React.createElement(Button, null, "Go to Feed")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Link, {
    href: "/auth/signin"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline"
  }, "Sign In")), /*#__PURE__*/React.createElement(Link, {
    href: "/auth/register"
  }, /*#__PURE__*/React.createElement(Button, null, "Get Started")))))), /*#__PURE__*/React.createElement("section", {
    className: "py-20 px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto text-center"
  }, /*#__PURE__*/React.createElement(Badge, {
    className: "mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200"
  }, "Powered by AI"), /*#__PURE__*/React.createElement("h1", {
    className: "text-5xl md:text-6xl font-bold text-gray-900 mb-6"
  }, "AI-Driven Faculty Analytics and Publication Summarization System"), /*#__PURE__*/React.createElement("p", {
    className: "text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
  }, "AcademiQ revolutionizes faculty analytics and research publication management through AI-powered summarization, comprehensive profiles, and institutional insights."), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-4 justify-center"
  }, /*#__PURE__*/React.createElement(Link, {
    href: "/auth/register"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    className: "px-8 py-3"
  }, "Get Started")), /*#__PURE__*/React.createElement(Link, {
    href: "#features"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "outline",
    className: "px-8 py-3"
  }, "Learn More"))))), /*#__PURE__*/React.createElement("section", {
    id: "features",
    className: "py-20 px-4 bg-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-16"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-4xl font-bold text-gray-900 mb-4"
  }, "Powerful Features for Academic Excellence"), /*#__PURE__*/React.createElement("p", {
    className: "text-xl text-gray-600 max-w-3xl mx-auto"
  }, "Everything you need to manage, analyze, and showcase academic research output")), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
  }, features.map((feature, index) => /*#__PURE__*/React.createElement(Card, {
    key: index,
    className: "hover:shadow-lg transition-shadow border-0 shadow-sm"
  }, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement("div", {
    className: `w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-4`
  }, /*#__PURE__*/React.createElement(feature.icon, {
    className: `w-6 h-6 ${feature.color}`
  })), /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-xl"
  }, feature.title)), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(CardDescription, {
    className: "text-gray-600"
  }, feature.description))))))), /*#__PURE__*/React.createElement("section", {
    id: "about",
    className: "py-20 px-4 bg-gray-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-2 gap-12 items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-4xl font-bold text-gray-900 mb-6"
  }, "About AcademiQ"), /*#__PURE__*/React.createElement("p", {
    className: "text-lg text-gray-600 mb-6"
  }, "AcademiQ is an innovative AI-driven platform designed to transform how academic institutions manage faculty research profiles and publications. By leveraging advanced Natural Language Processing techniques, we make complex research accessible and understandable."), /*#__PURE__*/React.createElement("p", {
    className: "text-lg text-gray-600 mb-6"
  }, "Our platform combines extractive and abstractive summarization techniques, comprehensive faculty analytics, and institutional insights to enhance research visibility and decision-making."), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-4"
  }, /*#__PURE__*/React.createElement(Badge, {
    className: "bg-blue-100 text-blue-800"
  }, "NLP Powered"), /*#__PURE__*/React.createElement(Badge, {
    className: "bg-green-100 text-green-800"
  }, "Real-time Analytics"), /*#__PURE__*/React.createElement(Badge, {
    className: "bg-purple-100 text-purple-800"
  }, "Cloud-based"), /*#__PURE__*/React.createElement(Badge, {
    className: "bg-orange-100 text-orange-800"
  }, "Secure"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 bg-blue-600 rounded-full"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-700"
  }, "Automatic publication summarization")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 bg-purple-600 rounded-full"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-700"
  }, "Faculty ranking and analytics")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 bg-green-600 rounded-full"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-700"
  }, "Student feedback analysis")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 bg-orange-600 rounded-full"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-700"
  }, "Institutional insights"))))))), /*#__PURE__*/React.createElement("footer", {
    className: "bg-gray-900 text-white py-12 px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center space-x-2 mb-4"
  }, /*#__PURE__*/React.createElement(Image, {
    src: logo,
    alt: "AcademiQ",
    className: "h-16 w-auto"
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400 mb-8"
  }, "Transforming academic research with AI intelligence.")), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
  }, /*#__PURE__*/React.createElement("p", null, "\xA9 2025 AcademiQ. All rights reserved.")))));
}
