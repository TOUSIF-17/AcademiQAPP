'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Edit, 
  BookOpen, 
  Plus, 
  Upload, 
  FileText,
  Brain,
  Calendar,
  TrendingUp,
  X,
  Trash2
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  userType: string;
  profileImage: string;
  bio: string;
  citations: number;
  hIndex: number;
  teachingWeight: number;
  createdAt: string;
}

interface Publication {
  id: string;
  title: string;
  authors: string;
  keywords: string;
  journal: string;
  volume: string;
  issue: string;
  pages: string;
  publicationDate: string;
  doi: string;
  citations: number;
  summary: string;
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

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showAddPublication, setShowAddPublication] = useState(false);
  const [deletingPublication, setDeletingPublication] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    userType: ''
  });

  const [publicationForm, setPublicationForm] = useState({
    title: '',
    authors: '',
    keywords: '',
    journal: '',
    volume: '',
    issue: '',
    pages: '',
    publicationDate: '',
    doi: '',
    file: null as File | null
  });

  const [summaries, setSummaries] = useState({
    summary: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/signin');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setEditForm({
      name: parsedUser.name,
      bio: parsedUser.bio || '',
      userType: parsedUser.userType
    });

    fetchUserPublications();
  }, []);

  const fetchUserPublications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/publications/my-publications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPublications(data.publications);
      }
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.user);
        localStorage.setItem('user', JSON.stringify(updatedUser.user));
        setEditing(false);
        setSuccess('Profile updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update profile');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPublicationForm({ ...publicationForm, file });
      
      // Don't auto-populate abstract anymore - user will fill it manually
      setSuccess('File attached successfully');
    }
  };

  const generateSummaries = async () => {
    if (!publicationForm.file) {
      setError('Please attach a publication file first');
      return;
    }

    setGeneratingSummary(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', publicationForm.file);
      
      const response = await fetch('/api/publications/summarize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setSummaries({
          summary: data.summary || ''
        });
        setSuccess('Summary generated successfully');
      } else {
        setError('Failed to generate summary');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleDeletePublication = async (publicationId: string) => {
    if (!confirm('Are you sure you want to delete this publication? This action cannot be undone.')) {
      return;
    }

    setDeletingPublication(publicationId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/publications/${publicationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess('Publication deleted successfully');
        fetchUserPublications(); // Refresh the publications list
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete publication');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setDeletingPublication(null);
    }
  };

  const handleSubmitPublication = async () => {

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      Object.entries(publicationForm).forEach(([key, value]) => {
        if (key !== 'file' && value !== null) {
          formData.append(key, value);
        }
      });

      if (publicationForm.file) {
        formData.append('file', publicationForm.file);
      }

      // Add summary to form data
      formData.append('summary', summaries.summary);

      const response = await fetch('/api/publications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setSuccess('Publication added successfully');
        setShowAddPublication(false);
        setPublicationForm({
          title: '',
          authors: '',
          keywords: '',
          journal: '',
          volume: '',
          issue: '',
          pages: '',
          publicationDate: '',
          doi: '',
          file: null
        });
        setSummaries({ summary: '' });
        fetchUserPublications();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add publication');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing(!editing)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="userType">User Type</Label>
                      <Input
                        id="userType"
                        value={editForm.userType}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleEditProfile} size="sm">
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditing(false)} size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold">{user.name}</h3>
                      <p className="text-gray-600">{user.userType}</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Email:</span> {user.email}
                      </div>
                      <div>
                        <span className="font-medium">Department:</span> {user.department}
                      </div>
                      <div>
                        <span className="font-medium">User Type:</span> {user.userType}
                      </div>
                      {user.bio && (
                        <div>
                          <span className="font-medium">Bio:</span>
                          <p className="mt-1 text-gray-600">{user.bio}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{user.citations}</div>
                        <div className="text-sm text-gray-600">Citations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{user.hIndex}</div>
                        <div className="text-sm text-gray-600">H-Index</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Publications Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    My Publications ({publications.length})
                  </CardTitle>
                  
                  <Dialog open={showAddPublication} onOpenChange={setShowAddPublication}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Publication
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Publication</DialogTitle>
                        <DialogDescription>
                          Upload your research paper and generate AI-powered summaries
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="title">Title *</Label>
                            <Input
                              id="title"
                              value={publicationForm.title}
                              onChange={(e) => setPublicationForm({ ...publicationForm, title: e.target.value })}
                              placeholder="Publication title"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="journal">Journal *</Label>
                            <Input
                              id="journal"
                              value={publicationForm.journal}
                              onChange={(e) => setPublicationForm({ ...publicationForm, journal: e.target.value })}
                              placeholder="Journal name"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="publicationDate">Publication Date *</Label>
                            <Input
                              id="publicationDate"
                              type="date"
                              value={publicationForm.publicationDate}
                              onChange={(e) => setPublicationForm({ ...publicationForm, publicationDate: e.target.value })}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="volume">Volume</Label>
                            <Input
                              id="volume"
                              value={publicationForm.volume}
                              onChange={(e) => setPublicationForm({ ...publicationForm, volume: e.target.value })}
                              placeholder="Volume"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="issue">Issue</Label>
                            <Input
                              id="issue"
                              value={publicationForm.issue}
                              onChange={(e) => setPublicationForm({ ...publicationForm, issue: e.target.value })}
                              placeholder="Issue"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="authors">Authors (comma-separated)</Label>
                          <Input
                            id="authors"
                            value={publicationForm.authors}
                            onChange={(e) => setPublicationForm({ ...publicationForm, authors: e.target.value })}
                            placeholder="Author 1, Author 2, Author 3"
                          />
                        </div>

                        <div>
                          <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                          <Input
                            id="keywords"
                            value={publicationForm.keywords}
                            onChange={(e) => setPublicationForm({ ...publicationForm, keywords: e.target.value })}
                            placeholder="Keyword 1, Keyword 2, Keyword 3"
                          />
                        </div>

                        <div>
                          <Label htmlFor="doi">DOI</Label>
                          <Input
                            id="doi"
                            value={publicationForm.doi}
                            onChange={(e) => setPublicationForm({ ...publicationForm, doi: e.target.value })}
                            placeholder="10.1000/182"
                          />
                        </div>

                        {/* Summary (filled by Generate Summary) */}
                        <div>
                          <Label htmlFor="summary">Summary</Label>
                          <Textarea
                            id="summary"
                            value={summaries.summary}
                            onChange={(e) => setSummaries({ summary: e.target.value })}
                            rows={6}
                            placeholder="Generate or write a concise summary of your publication"
                          />
                        </div>

                        {/* File Upload */
                        }
                        <div>
                          <Label htmlFor="file">Attach Publication File</Label>
                          <div className="mt-2">
                            <Input
                              id="file"
                              type="file"
                              accept=".pdf,.docx"
                              onChange={handleFileUpload}
                              className="cursor-pointer"
                            />
                          </div>
                          {publicationForm.file && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                              <FileText className="h-4 w-4" />
                              {publicationForm.file.name}
                            </div>
                          )}
                          <div className="mt-4">
                            <Button onClick={generateSummaries} disabled={generatingSummary || !publicationForm.file} variant="outline">
                              {generatingSummary ? 'Generating summary...' : 'Generate Summary'}
                            </Button>
                          </div>
                        </div>


                        {/* Submit Button */}
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowAddPublication(false)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSubmitPublication}
                            disabled={uploading}
                          >
                            {uploading ? 'Publishing...' : 'Add Publication'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              
              <CardContent>
                {publications.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No publications yet</h3>
                    <p className="text-gray-600 mb-4">Add your first publication to get started</p>
                    <Button onClick={() => setShowAddPublication(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Publication
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {publications.map((publication) => (
                      <Card key={publication.id} className="border-l-4 border-l-blue-600">
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <h4 className="font-semibold text-lg flex-1">{publication.title}</h4>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeletePublication(publication.id)}
                                disabled={deletingPublication === publication.id}
                              >
                                {deletingPublication === publication.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(publication.publicationDate)}
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                {publication.citations} citations
                              </div>
                            </div>
                            
                            {publication.summary && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Brain className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium">AI Summary</span>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                  {publication.summary}
                                </p>
                              </div>
                            )}
                            
                            {publication.keywords && (
                              <div className="flex flex-wrap gap-2">
                                {publication.keywords.split(',').map((keyword, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {keyword.trim()}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}