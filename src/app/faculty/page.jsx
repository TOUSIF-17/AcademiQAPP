'use client';

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

  const departments = [
    'all',
    'Computer Science and Engineering',
    'Electronics and Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Information Science',
    'Artificial Intelligence',
    'Data Science',
  ];

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
          filteredFaculty = filteredFaculty.filter(f =>
            f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.userType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
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

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Component Render ---
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Directory</h1>
          <p className="text-gray-600">Discover and connect with faculty members across departments</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search faculty by name, specialization, or email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="lg:w-64">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Faculty Members Yet</h3>
              <p className="text-gray-600 mb-4">Be the first to register and join the academic community!</p>
              <Button onClick={() => router.push('/auth/register')}>Register as Faculty</Button>
            </div>
          ) : (
            faculty.map(facultyMember => (
              <Card key={facultyMember.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={facultyMember.profileImage} alt={facultyMember.name} />
                      <AvatarFallback className="text-lg">{getInitials(facultyMember.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{facultyMember.name}</CardTitle>
                      <CardDescription className="font-medium text-gray-700">
                        {facultyMember.userType}
                      </CardDescription>
                      <Badge variant="outline" className="mt-1">
                        {facultyMember.department}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {facultyMember.bio && (
                      <p className="text-sm text-gray-600 line-clamp-2">{facultyMember.bio}</p>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{facultyMember.userType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{facultyMember.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="h-4 w-4" />
                        <span>{facultyMember.department}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{facultyMember.citations}</div>
                        <div className="text-xs text-gray-600">Citations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">{facultyMember.hIndex}</div>
                        <div className="text-xs text-gray-600">H-Index</div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Publications
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer Stats Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">{faculty.length}</div>
              <div className="text-blue-100">Total Faculty</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">
                {faculty.reduce((sum, f) => sum + f.citations, 0)}
              </div>
              <div className="text-blue-100">Total Citations</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">
                {Math.round(faculty.reduce((sum, f) => sum + f.hIndex, 0) / faculty.length) || 0}
              </div>
              <div className="text-blue-100">Average H-Index</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">
                {new Set(faculty.map(f => f.department)).size}
              </div>
              <div className="text-blue-100">Departments</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}