'use client';
import React from 'react';


import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, User, TrendingUp, BarChart3, BookOpen } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
export default function Analytics() {
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  const [chartType, setChartType] = useState('publications');
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      window.location.href = '/auth/signin';
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchAnalytics();
  }, [timeRange]);
  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };
  const exportData = () => {
    if (!analytics) return;
    const csvContent = [['Year', 'Publications', 'Citations'], ...analytics.publicationTrends.map(item => [item.year, item.count, item.citations])].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'academiq_analytics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
    }, "Loading analytics...")));
  }
  if (!analytics) {
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen bg-gray-50"
    }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement(BarChart3, {
      className: "h-16 w-16 text-slate-300 mx-auto mb-4"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "text-xl font-semibold text-slate-900 mb-2"
    }, "No analytics data available"), /*#__PURE__*/React.createElement("p", {
      className: "text-slate-600"
    }, "Start adding publications to see analytics.")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gray-50"
  }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto px-4 py-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-8"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold text-slate-900 mb-2"
  }, "Analytics Dashboard"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-600"
  }, "Comprehensive insights into research performance and trends")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4"
  }, /*#__PURE__*/React.createElement(Select, {
    value: timeRange,
    onValueChange: setTimeRange
  }, /*#__PURE__*/React.createElement(SelectTrigger, {
    className: "w-40"
  }, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Time Range"
  })), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "all"
  }, "All Time"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "year"
  }, "This Year"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "6months"
  }, "6 Months"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "3months"
  }, "3 Months"))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    className: "flex flex-row items-center justify-between space-y-0 pb-2"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-sm font-medium"
  }, "Total Publications"), /*#__PURE__*/React.createElement(BookOpen, {
    className: "h-4 w-4 text-muted-foreground"
  })), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold"
  }, analytics.publicationTrends.reduce((sum, item) => sum + item.count, 0)), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-muted-foreground"
  }, "+12% from last period"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    className: "flex flex-row items-center justify-between space-y-0 pb-2"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-sm font-medium"
  }, "Total Citations"), /*#__PURE__*/React.createElement(TrendingUp, {
    className: "h-4 w-4 text-muted-foreground"
  })), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold"
  }, analytics.publicationTrends.reduce((sum, item) => sum + item.citations, 0)), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-muted-foreground"
  }, "+23% from last period"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    className: "flex flex-row items-center justify-between space-y-0 pb-2"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-sm font-medium"
  }, "Active Researchers"), /*#__PURE__*/React.createElement(User, {
    className: "h-4 w-4 text-muted-foreground"
  })), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold"
  }, analytics.topAuthors.length), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-muted-foreground"
  }, "+5% from last period"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    className: "flex flex-row items-center justify-between space-y-0 pb-2"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-sm font-medium"
  }, "Departments"), /*#__PURE__*/React.createElement(BarChart3, {
    className: "h-4 w-4 text-muted-foreground"
  })), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold"
  }, analytics.departmentStats.length), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-muted-foreground"
  }, "Active departments")))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Publication Trends"), /*#__PURE__*/React.createElement(CardDescription, null, "Research output over time")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 300
  }, /*#__PURE__*/React.createElement(AreaChart, {
    data: analytics.publicationTrends
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3"
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "year"
  }), /*#__PURE__*/React.createElement(YAxis, null), /*#__PURE__*/React.createElement(Tooltip, null), /*#__PURE__*/React.createElement(Area, {
    type: "monotone",
    dataKey: "count",
    stroke: "#8884d8",
    fill: "#8884d8",
    fillOpacity: 0.6,
    name: "Publications"
  }))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Department Performance"), /*#__PURE__*/React.createElement(CardDescription, null, "Publications by department")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 300
  }, /*#__PURE__*/React.createElement(BarChart, {
    data: analytics.departmentStats
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3"
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "department"
  }), /*#__PURE__*/React.createElement(YAxis, null), /*#__PURE__*/React.createElement(Tooltip, null), /*#__PURE__*/React.createElement(Bar, {
    dataKey: "publications",
    fill: "#82ca9d",
    name: "Publications"
  }))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Monthly Activity"), /*#__PURE__*/React.createElement(CardDescription, null, "Recent publication activity")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 300
  }, /*#__PURE__*/React.createElement(LineChart, {
    data: analytics.monthlyTrends
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3"
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "month"
  }), /*#__PURE__*/React.createElement(YAxis, null), /*#__PURE__*/React.createElement(Tooltip, null), /*#__PURE__*/React.createElement(Line, {
    type: "monotone",
    dataKey: "publications",
    stroke: "#8884d8",
    strokeWidth: 2,
    name: "Publications"
  }), /*#__PURE__*/React.createElement(Line, {
    type: "monotone",
    dataKey: "citations",
    stroke: "#82ca9d",
    strokeWidth: 2,
    name: "Citations"
  }))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Research Areas"), /*#__PURE__*/React.createElement(CardDescription, null, "Distribution of research focus")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 300
  }, /*#__PURE__*/React.createElement(PieChart, null, /*#__PURE__*/React.createElement(Pie, {
    data: analytics.researchAreas,
    cx: "50%",
    cy: "50%",
    labelLine: false,
    label: ({
      area,
      percent
    }) => `${area} ${(percent * 100).toFixed(0)}%`,
    outerRadius: 80,
    fill: "#8884d8",
    dataKey: "count"
  }, analytics.researchAreas.map((entry, index) => /*#__PURE__*/React.createElement(Cell, {
    key: `cell-${index}`,
    fill: COLORS[index % COLORS.length]
  }))), /*#__PURE__*/React.createElement(Tooltip, null)))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Top Researchers"), /*#__PURE__*/React.createElement(CardDescription, null, "Leading contributors by publications and citations")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, analytics.topAuthors.slice(0, 10).map((author, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "flex items-center justify-between p-3 rounded-lg border"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm"
  }, index + 1), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-semibold"
  }, author.name), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-600"
  }, author.publications, " publications \u2022 ", author.citations, " citations"))), /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-blue-600"
  }, (author.citations / Math.max(author.publications, 1)).toFixed(1), " avg cites")))))))));
}

