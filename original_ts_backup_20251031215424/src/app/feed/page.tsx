'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Calendar, 
  User, 
  Search, 
  Filter,
  FileText,
  Brain,
  TrendingUp,
  Eye
} from 'lucide-react';
import Link from 'next/link';

interface Publication {
  id: string;
  title: string;
  authors: string;
  abstract: string;
  keywords: string;
  journal: string;
  publicationDate: string | null;
  citations: number;
  summary: string | null;
  author: {
    id: string;
    name: string;
    email: string;
    department: string;
    userType: string;
    profileImage: string;
  };
  createdAt: string;
}

export default function FeedPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSummary, setSelectedSummary] = useState('simple');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
    'Data Science'
  ];

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
        limit: '10',
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

  const getSummaryText = (publication: Publication) => {
    return publication.summary || publication.abstract?.substring(0, 200) + '...' || '';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && publications.length === 0) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Research Feed</h1>
          <p className="text-gray-600">Discover the latest research publications from your institution</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search publications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="lg:w-48">
              <Select value={selectedSummary} onValueChange={setSelectedSummary}>
                <SelectTrigger>
                  <SelectValue placeholder="Summary Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hybrid">Hybrid Summary</SelectItem>
                  <SelectItem value="extractive">Extractive</SelectItem>
                  <SelectItem value="abstractive">Abstractive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Publications Grid */}
        <div className="grid gap-6">
          {publications.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Publications Yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first research publication!</p>
              <Button onClick={() => router.push('/profile')}>
                Add Your First Publication
              </Button>
            </div>
          ) : (
            publications.map((publication) => (
              <Card key={publication.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 line-clamp-2">
                        {publication.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{publication.author.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(publication.publicationDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{publication.citations} citations</span>
                        </div>
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      {publication.department}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Authors */}
                    <div className="flex flex-wrap gap-2">
                      {publication.authors && publication.authors.split(',').map((author, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {author.trim()}
                        </Badge>
                      ))}
                    </div>

                    {/* Summary */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {selectedSummary === 'hybrid' ? 'AI-Generated Summary' : 
                           selectedSummary === 'extractive' ? 'Extractive Summary' : 'Abstractive Summary'}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {getSummaryText(publication)}
                      </p>
                    </div>

                    {/* Keywords */}
                    {publication.keywords && (
                      <div className="flex flex-wrap gap-2">
                        {publication.keywords.split(',').map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {keyword.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        Published in <span className="font-medium">{publication.journal}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/publications/${publication.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}