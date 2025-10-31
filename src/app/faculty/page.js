'use client';
import React from 'react';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Search, BookOpen, Mail, Building, User } from 'lucide-react';
export default function FacultyPage() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const router = useRouter();
  const departments = ['all', 'Computer Science and Engineering', 'Electronics and Communication', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Information Science', 'Artificial Intelligence', 'Data Science'];
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/signin');
      return;
    }
    fetchFaculty();
  }, [selectedDepartment, searchTerm]);
  const fetchFaculty = async () => {
    try {
      setLoading(true);

      // Fetch from API - no demo data
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/faculty', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        let filteredFaculty = data.faculty || [];
        if (selectedDepartment !== 'all') {
          filteredFaculty = filteredFaculty.filter(f => f.department === selectedDepartment);
        }
        if (searchTerm) {
          filteredFaculty = filteredFaculty.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.userType.toLowerCase().includes(searchTerm.toLowerCase()) || f.email.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        setFaculty(filteredFaculty);
      } else {
        setFaculty([]);
      }
    } catch (error) {
      console.error('Error fetching faculty:', error);
      setFaculty([]);
    } finally {
      setLoading(false);
    }
  };
  const getInitials = name => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gray-50"
  }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto px-4 py-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-8"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold text-gray-900 mb-2"
  }, "Faculty Directory"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600"
  }, "Discover and connect with faculty members across departments")), /*#__PURE__*/React.createElement("div", {
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
    placeholder: "Search faculty by name, specialization, or email...",
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
  }, dept === 'all' ? 'All Departments' : dept))))))), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
  }, faculty.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "col-span-full text-center py-12"
  }, /*#__PURE__*/React.createElement(Users, {
    className: "mx-auto h-12 w-12 text-gray-400 mb-4"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-medium text-gray-900 mb-2"
  }, "No Faculty Members Yet"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 mb-4"
  }, "Be the first to register and join the academic community!"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => router.push('/auth/register')
  }, "Register as Faculty")) : faculty.map(facultyMember => /*#__PURE__*/React.createElement(Card, {
    key: facultyMember.id,
    className: "hover:shadow-lg transition-shadow"
  }, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4"
  }, /*#__PURE__*/React.createElement(Avatar, {
    className: "h-16 w-16"
  }, /*#__PURE__*/React.createElement(AvatarImage, {
    src: facultyMember.profileImage,
    alt: facultyMember.name
  }), /*#__PURE__*/React.createElement(AvatarFallback, {
    className: "text-lg"
  }, getInitials(facultyMember.name))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-lg"
  }, facultyMember.name), /*#__PURE__*/React.createElement(CardDescription, {
    className: "font-medium text-gray-700"
  }, facultyMember.userType), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline",
    className: "mt-1"
  }, facultyMember.department)))), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, facultyMember.bio && /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 line-clamp-2"
  }, facultyMember.bio), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-sm text-gray-600"
  }, /*#__PURE__*/React.createElement(User, {
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, facultyMember.userType)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-sm text-gray-600"
  }, /*#__PURE__*/React.createElement(Mail, {
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", {
    className: "truncate"
  }, facultyMember.email)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-sm text-gray-600"
  }, /*#__PURE__*/React.createElement(Building, {
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, facultyMember.department))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4 pt-4 border-t"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-bold text-blue-600"
  }, facultyMember.citations), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-600"
  }, "Citations")), /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-bold text-purple-600"
  }, facultyMember.hIndex), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-600"
  }, "H-Index"))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 pt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(BookOpen, {
    className: "h-4 w-4 mr-2"
  }), "Publications"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(Mail, {
    className: "h-4 w-4 mr-2"
  }), "Contact"))))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-4 gap-6 text-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-3xl font-bold mb-2"
  }, faculty.length), /*#__PURE__*/React.createElement("div", {
    className: "text-blue-100"
  }, "Total Faculty")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-3xl font-bold mb-2"
  }, faculty.reduce((sum, f) => sum + f.citations, 0)), /*#__PURE__*/React.createElement("div", {
    className: "text-blue-100"
  }, "Total Citations")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-3xl font-bold mb-2"
  }, Math.round(faculty.reduce((sum, f) => sum + f.hIndex, 0) / faculty.length) || 0), /*#__PURE__*/React.createElement("div", {
    className: "text-blue-100"
  }, "Average H-Index")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-3xl font-bold mb-2"
  }, new Set(faculty.map(f => f.department)).size), /*#__PURE__*/React.createElement("div", {
    className: "text-blue-100"
  }, "Departments"))))));
}

