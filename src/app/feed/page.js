'use client';
import React from 'react';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Calendar, User, Search, Brain, TrendingUp, Eye } from 'lucide-react';
import Link from 'next/link';
export default function FeedPage() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSummary, setSelectedSummary] = useState('simple');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const departments = ['all', 'Computer Science and Engineering', 'Electronics and Communication', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Information Science', 'Artificial Intelligence', 'Data Science'];
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/signin');
      return;
    }
    fetchPublications();
  }, [currentPage, selectedDepartment, searchTerm]);
  const fetchPublications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      if (selectedDepartment !== 'all') {
        params.append('department', selectedDepartment);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      const response = await fetch(`/api/publications?${params}`);
      const data = await response.json();
      if (response.ok) {
        setPublications(data.publications);
        setTotalPages(data.pagination.pages);
      } else {
        console.error('Failed to fetch publications');
      }
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setLoading(false);
    }
  };
  const getSummaryText = publication => {
    return publication.summary || publication.abstract?.substring(0, 200) + '...' || '';
  };
  const formatDate = dateString => {
    if (!dateString) return 'Date not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  if (loading && publications.length === 0) {
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
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gray-50"
  }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto px-4 py-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-8"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold text-gray-900 mb-2"
  }, "Research Feed"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600"
  }, "Discover the latest research publications from your institution")), /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-lg shadow-sm border p-4 mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col lg:flex-row gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(Search, {
    className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
  }), /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search publications...",
    value: searchTerm,
    onChange: e => setSearchTerm(e.target.value),
    className: "pl-10"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lg:w-64"
  }, /*#__PURE__*/React.createElement(Select, {
    value: selectedDepartment,
    onValueChange: setSelectedDepartment
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Select Department"
  })), /*#__PURE__*/React.createElement(SelectContent, null, departments.map(dept => /*#__PURE__*/React.createElement(SelectItem, {
    key: dept,
    value: dept
  }, dept === 'all' ? 'All Departments' : dept))))), /*#__PURE__*/React.createElement("div", {
    className: "lg:w-48"
  }, /*#__PURE__*/React.createElement(Select, {
    value: selectedSummary,
    onValueChange: setSelectedSummary
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Summary Type"
  })), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "hybrid"
  }, "Hybrid Summary"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "extractive"
  }, "Extractive"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "abstractive"
  }, "Abstractive")))))), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-6"
  }, publications.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-12"
  }, /*#__PURE__*/React.createElement(BookOpen, {
    className: "mx-auto h-12 w-12 text-gray-400 mb-4"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-medium text-gray-900 mb-2"
  }, "No Publications Yet"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 mb-4"
  }, "Start by adding your first research publication!"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => router.push('/profile')
  }, "Add Your First Publication")) : publications.map(publication => /*#__PURE__*/React.createElement(Card, {
    key: publication.id,
    className: "hover:shadow-md transition-shadow"
  }, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-xl mb-2 line-clamp-2"
  }, publication.title), /*#__PURE__*/React.createElement(CardDescription, {
    className: "flex items-center gap-4 text-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(User, {
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, publication.author.name)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(Calendar, {
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, formatDate(publication.publicationDate))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(TrendingUp, {
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, publication.citations, " citations")))), /*#__PURE__*/React.createElement(Badge, {
    variant: "secondary",
    className: "ml-4"
  }, publication.department))), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, publication.authors && publication.authors.split(',').map((author, index) => /*#__PURE__*/React.createElement(Badge, {
    key: index,
    variant: "outline",
    className: "text-xs"
  }, author.trim()))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-2"
  }, /*#__PURE__*/React.createElement(Brain, {
    className: "h-4 w-4 text-blue-600"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium text-gray-700"
  }, selectedSummary === 'hybrid' ? 'AI-Generated Summary' : selectedSummary === 'extractive' ? 'Extractive Summary' : 'Abstractive Summary')), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 leading-relaxed"
  }, getSummaryText(publication))), publication.keywords && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, publication.keywords.split(',').map((keyword, index) => /*#__PURE__*/React.createElement(Badge, {
    key: index,
    variant: "outline",
    className: "text-xs bg-blue-50 text-blue-700 border-blue-200"
  }, keyword.trim()))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pt-4 border-t"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-500"
  }, "Published in ", /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, publication.journal)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Link, {
    href: `/publications/${publication.id}`
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm"
  }, /*#__PURE__*/React.createElement(Eye, {
    className: "h-4 w-4 mr-2"
  }), "View Details"))))))))), totalPages > 1 && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-2 mt-8"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => setCurrentPage(prev => Math.max(prev - 1, 1)),
    disabled: currentPage === 1
  }, "Previous"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, Array.from({
    length: Math.min(5, totalPages)
  }, (_, i) => {
    const page = i + 1;
    return /*#__PURE__*/React.createElement(Button, {
      key: page,
      variant: currentPage === page ? "default" : "outline",
      size: "sm",
      onClick: () => setCurrentPage(page)
    }, page);
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)),
    disabled: currentPage === totalPages
  }, "Next"))));
}

