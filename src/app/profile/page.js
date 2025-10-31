'use client';
import React from 'react';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Edit, BookOpen, Plus, FileText, Brain, Calendar, TrendingUp, Trash2 } from 'lucide-react';
export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showAddPublication, setShowAddPublication] = useState(false);
  const [deletingPublication, setDeletingPublication] = useState(null);
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
    file: null
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
  const handleFileUpload = async e => {
    const file = e.target.files?.[0];
    if (file) {
      setPublicationForm({
        ...publicationForm,
        file
      });

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
  const handleDeletePublication = async publicationId => {
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
        setSummaries({
          summary: ''
        });
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
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
  if (!user) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gray-50"
  }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto px-4 py-8"
  }, error && /*#__PURE__*/React.createElement(Alert, {
    variant: "destructive",
    className: "mb-6"
  }, /*#__PURE__*/React.createElement(AlertDescription, null, error)), success && /*#__PURE__*/React.createElement(Alert, {
    className: "mb-6 border-green-200 bg-green-50 text-green-800"
  }, /*#__PURE__*/React.createElement(AlertDescription, null, success)), /*#__PURE__*/React.createElement("div", {
    className: "grid lg:grid-cols-3 gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-1"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(User, {
    className: "h-5 w-5"
  }), "Profile"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => setEditing(!editing)
  }, /*#__PURE__*/React.createElement(Edit, {
    className: "h-4 w-4"
  })))), /*#__PURE__*/React.createElement(CardContent, null, editing ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "name"
  }, "Name"), /*#__PURE__*/React.createElement(Input, {
    id: "name",
    value: editForm.name,
    onChange: e => setEditForm({
      ...editForm,
      name: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "bio"
  }, "Bio"), /*#__PURE__*/React.createElement(Textarea, {
    id: "bio",
    value: editForm.bio,
    onChange: e => setEditForm({
      ...editForm,
      bio: e.target.value
    }),
    rows: 3
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "userType"
  }, "User Type"), /*#__PURE__*/React.createElement(Input, {
    id: "userType",
    value: editForm.userType,
    disabled: true,
    className: "bg-gray-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: handleEditProfile,
    size: "sm"
  }, "Save"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => setEditing(false),
    size: "sm"
  }, "Cancel"))) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-white text-2xl font-bold"
  }, user.name.split(' ').map(n => n[0]).join(''))), /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-semibold"
  }, user.name), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600"
  }, user.userType)), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 text-sm"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, "Email:"), " ", user.email), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, "Department:"), " ", user.department), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, "User Type:"), " ", user.userType), user.bio && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, "Bio:"), /*#__PURE__*/React.createElement("p", {
    className: "mt-1 text-gray-600"
  }, user.bio))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4 pt-4 border-t"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold text-blue-600"
  }, user.citations), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-600"
  }, "Citations")), /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold text-purple-600"
  }, user.hIndex), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-600"
  }, "H-Index"))))))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(BookOpen, {
    className: "h-5 w-5"
  }), "My Publications (", publications.length, ")"), /*#__PURE__*/React.createElement(Dialog, {
    open: showAddPublication,
    onOpenChange: setShowAddPublication
  }, /*#__PURE__*/React.createElement(DialogTrigger, {
    asChild: true
  }, /*#__PURE__*/React.createElement(Button, null, /*#__PURE__*/React.createElement(Plus, {
    className: "h-4 w-4 mr-2"
  }), "Add Publication")), /*#__PURE__*/React.createElement(DialogContent, {
    className: "max-w-4xl max-h-[90vh] overflow-y-auto"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, null, "Add New Publication"), /*#__PURE__*/React.createElement(DialogDescription, null, "Upload your research paper and generate AI-powered summaries")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "title"
  }, "Title *"), /*#__PURE__*/React.createElement(Input, {
    id: "title",
    value: publicationForm.title,
    onChange: e => setPublicationForm({
      ...publicationForm,
      title: e.target.value
    }),
    placeholder: "Publication title"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "journal"
  }, "Journal *"), /*#__PURE__*/React.createElement(Input, {
    id: "journal",
    value: publicationForm.journal,
    onChange: e => setPublicationForm({
      ...publicationForm,
      journal: e.target.value
    }),
    placeholder: "Journal name"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-3 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "publicationDate"
  }, "Publication Date *"), /*#__PURE__*/React.createElement(Input, {
    id: "publicationDate",
    type: "date",
    value: publicationForm.publicationDate,
    onChange: e => setPublicationForm({
      ...publicationForm,
      publicationDate: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "volume"
  }, "Volume"), /*#__PURE__*/React.createElement(Input, {
    id: "volume",
    value: publicationForm.volume,
    onChange: e => setPublicationForm({
      ...publicationForm,
      volume: e.target.value
    }),
    placeholder: "Volume"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "issue"
  }, "Issue"), /*#__PURE__*/React.createElement(Input, {
    id: "issue",
    value: publicationForm.issue,
    onChange: e => setPublicationForm({
      ...publicationForm,
      issue: e.target.value
    }),
    placeholder: "Issue"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "authors"
  }, "Authors (comma-separated)"), /*#__PURE__*/React.createElement(Input, {
    id: "authors",
    value: publicationForm.authors,
    onChange: e => setPublicationForm({
      ...publicationForm,
      authors: e.target.value
    }),
    placeholder: "Author 1, Author 2, Author 3"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "keywords"
  }, "Keywords (comma-separated)"), /*#__PURE__*/React.createElement(Input, {
    id: "keywords",
    value: publicationForm.keywords,
    onChange: e => setPublicationForm({
      ...publicationForm,
      keywords: e.target.value
    }),
    placeholder: "Keyword 1, Keyword 2, Keyword 3"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "doi"
  }, "DOI"), /*#__PURE__*/React.createElement(Input, {
    id: "doi",
    value: publicationForm.doi,
    onChange: e => setPublicationForm({
      ...publicationForm,
      doi: e.target.value
    }),
    placeholder: "10.1000/182"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "summary"
  }, "Summary"), /*#__PURE__*/React.createElement(Textarea, {
    id: "summary",
    value: summaries.summary,
    onChange: e => setSummaries({
      summary: e.target.value
    }),
    rows: 6,
    placeholder: "Generate or write a concise summary of your publication"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "file"
  }, "Attach Publication File"), /*#__PURE__*/React.createElement("div", {
    className: "mt-2"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "file",
    type: "file",
    accept: ".pdf,.docx",
    onChange: handleFileUpload,
    className: "cursor-pointer"
  })), publicationForm.file && /*#__PURE__*/React.createElement("div", {
    className: "mt-2 flex items-center gap-2 text-sm text-green-600"
  }, /*#__PURE__*/React.createElement(FileText, {
    className: "h-4 w-4"
  }), publicationForm.file.name), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: generateSummaries,
    disabled: generatingSummary || !publicationForm.file,
    variant: "outline"
  }, generatingSummary ? 'Generating summary...' : 'Generate Summary'))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => setShowAddPublication(false)
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    onClick: handleSubmitPublication,
    disabled: uploading
  }, uploading ? 'Publishing...' : 'Add Publication'))))))), /*#__PURE__*/React.createElement(CardContent, null, publications.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-12"
  }, /*#__PURE__*/React.createElement(BookOpen, {
    className: "mx-auto h-12 w-12 text-gray-400 mb-4"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-medium text-gray-900 mb-2"
  }, "No publications yet"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 mb-4"
  }, "Add your first publication to get started"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setShowAddPublication(true)
  }, /*#__PURE__*/React.createElement(Plus, {
    className: "h-4 w-4 mr-2"
  }), "Add Publication")) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, publications.map(publication => /*#__PURE__*/React.createElement(Card, {
    key: publication.id,
    className: "border-l-4 border-l-blue-600"
  }, /*#__PURE__*/React.createElement(CardContent, {
    className: "pt-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-semibold text-lg flex-1"
  }, publication.title), /*#__PURE__*/React.createElement(Button, {
    variant: "destructive",
    size: "sm",
    onClick: () => handleDeletePublication(publication.id),
    disabled: deletingPublication === publication.id
  }, deletingPublication === publication.id ? /*#__PURE__*/React.createElement("div", {
    className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white"
  }) : /*#__PURE__*/React.createElement(Trash2, {
    className: "h-4 w-4"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 text-sm text-gray-600"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(Calendar, {
    className: "h-4 w-4"
  }), formatDate(publication.publicationDate)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(TrendingUp, {
    className: "h-4 w-4"
  }), publication.citations, " citations")), publication.summary && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-2"
  }, /*#__PURE__*/React.createElement(Brain, {
    className: "h-4 w-4 text-blue-600"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium"
  }, "AI Summary")), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 text-sm leading-relaxed"
  }, publication.summary)), publication.keywords && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, publication.keywords.split(',').map((keyword, index) => /*#__PURE__*/React.createElement(Badge, {
    key: index,
    variant: "outline",
    className: "text-xs"
  }, keyword.trim()))))))))))))));
}

