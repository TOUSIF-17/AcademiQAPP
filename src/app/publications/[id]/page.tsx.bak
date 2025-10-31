'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  User, 
  BookOpen, 
  TrendingUp,
  Mail,
  Building,
  Download,
  ArrowLeft,
  Brain
} from 'lucide-react';

interface Publication {
  id: string;
  title: string;
  authors: string;
  abstract: string;
  keywords: string;
  journal: string;
  volume: string;
  issue: string;
  pages: string;
  publicationDate: string | null;
  doi: string;
  citations: number;
  summary: string | null;
  fileName: string;
  filePath: string;
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

export default function PublicationDetailPage() {
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();
  const router = useRouter();
  const { id } = params;

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

  const formatDate = (dateString: string | null) => {
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

  if (error || !publication) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Publication Not Found</h3>
            <p className="text-gray-600 mb-4">{error || 'The publication you are looking for does not exist.'}</p>
            <Button onClick={() => router.push('/feed')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Feed
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => router.push('/feed')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Feed
        </Button>

        {/* Publication Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-4">{publication.title}</CardTitle>
                <CardDescription className="text-lg">
                  Published in <span className="font-medium">{publication.journal}</span>
                </CardDescription>
              </div>
              
              {publication.fileName && (
                <Button onClick={handleDownload} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {/* Authors */}
              <div>
                <h4 className="font-medium mb-2">Authors</h4>
                <div className="flex flex-wrap gap-2">
                  {publication.authors.split(',').map((author, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {author.trim()}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Publication Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{formatDate(publication.publicationDate)}</span>
                  </div>
                  
                  {publication.volume && (
                    <div className="text-sm">
                      <span className="font-medium">Volume:</span> {publication.volume}
                    </div>
                  )}
                  
                  {publication.issue && (
                    <div className="text-sm">
                      <span className="font-medium">Issue:</span> {publication.issue}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  {publication.pages && (
                    <div className="text-sm">
                      <span className="font-medium">Pages:</span> {publication.pages}
                    </div>
                  )}
                  
                  {publication.doi && (
                    <div className="text-sm">
                      <span className="font-medium">DOI:</span> 
                      <a 
                        href={`https://doi.org/${publication.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline ml-1"
                      >
                        {publication.doi}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <span>{publication.citations} citations</span>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              {publication.keywords && (
                <div>
                  <h4 className="font-medium mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {publication.keywords.split(',').map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        {keyword.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Abstract */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Abstract</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {publication.abstract}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Author Info */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={publication.author.profileImage} alt={publication.author.name} />
                      <AvatarFallback>
                        {publication.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{publication.author.name}</h4>
                      <p className="text-sm text-gray-600">{publication.author.userType}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{publication.author.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>{publication.author.department}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Summary */}
        {publication.summary && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  {publication.summary}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}