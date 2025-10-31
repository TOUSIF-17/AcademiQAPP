'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Brain, User, TrendingUp, BarChart3, LogOut, BookOpen, Mail, Calendar, ArrowLeft } from 'lucide-react'

interface Faculty {
  id: string
  name: string
  email: string
  role: string
  department?: string
  designation?: string
  specialization?: string
  bio?: string
  citations: number
  publications: Array<{
    id: string
    title: string
    abstract?: string
    hybridSummary?: string
    authors?: string
    journal?: string
    year?: number
    doi?: string
    citations: number
    createdAt: string
  }>
}

export default function FacultyProfile() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      window.location.href = '/auth/signin'
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    
    if (params.id) {
      fetchFaculty(params.id as string)
    }
  }, [params.id])

  const fetchFaculty = async (facultyId: string) => {
    try {
      const response = await fetch(`/api/faculty/${facultyId}`)
      if (response.ok) {
        const data = await response.json()
        setFaculty(data)
      } else {
        router.push('/faculty')
      }
    } catch (error) {
      console.error('Error fetching faculty:', error)
      router.push('/faculty')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-slate-600">Loading faculty profile...</p>
        </div>
      </div>
    )
  }

  if (!faculty) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Faculty not found</h3>
          <Link href="/faculty">
            <Button>Back to Faculty Directory</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link href="/feed" className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-slate-900">AcademiQ</span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/faculty" className="flex items-center space-x-2 text-blue-600">
                  <User className="h-4 w-4" />
                  <span>Faculty</span>
                </Link>
                <Link href="/rankings" className="flex items-center space-x-2 text-slate-600 hover:text-blue-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>Rankings</span>
                </Link>
                <Link href="/analytics" className="flex items-center space-x-2 text-slate-600 hover:text-blue-600">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </Link>
                <Link href="/profile" className="flex items-center space-x-2 text-slate-600 hover:text-blue-600">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Faculty
        </Button>

        {/* Faculty Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl">
                  {faculty.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{faculty.name}</CardTitle>
                <CardDescription className="text-lg mb-3">
                  {faculty.designation}
                  {faculty.department && ` • ${faculty.department}`}
                </CardDescription>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">{faculty.role}</Badge>
                  {faculty.specialization && (
                    <Badge variant="outline">{faculty.specialization}</Badge>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {faculty.publications.length} publications
                    </span>
                    <span className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {faculty.citations} citations
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {faculty.bio && (
            <CardContent>
              <h3 className="font-semibold text-slate-900 mb-2">About</h3>
              <p className="text-slate-700 leading-relaxed">{faculty.bio}</p>
            </CardContent>
          )}
        </Card>

        {/* Publications Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Publications</h2>
          
          {faculty.publications.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No publications yet</h3>
              <p className="text-slate-600">This faculty member hasn't added any publications yet.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {faculty.publications.map((publication) => (
                <Card key={publication.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{publication.title}</CardTitle>
                        <CardDescription className="flex items-center space-x-2 text-sm">
                          {publication.authors && <span>{publication.authors}</span>}
                          {publication.journal && (
                            <>
                              <span>•</span>
                              <span>{publication.journal}</span>
                            </>
                          )}
                          {publication.year && (
                            <>
                              <span>•</span>
                              <span>{publication.year}</span>
                            </>
                          )}
                          <span>•</span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(publication.createdAt).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {publication.citations} citations
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {publication.hybridSummary && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-slate-900 mb-2">AI Summary</h4>
                        <p className="text-slate-700 leading-relaxed">{publication.hybridSummary}</p>
                      </div>
                    )}

                    {publication.abstract && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-slate-900 mb-2">Abstract</h4>
                        <p className="text-slate-700 leading-relaxed line-clamp-3">
                          {publication.abstract}
                        </p>
                      </div>
                    )}

                    {publication.doi && (
                      <div className="text-sm text-slate-600">
                        <strong>DOI:</strong> {publication.doi}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {faculty.publications.length}
              </div>
              <div className="text-slate-600">Total Publications</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {faculty.citations}
              </div>
              <div className="text-slate-600">Total Citations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {faculty.publications.length > 0 
                  ? Math.round(faculty.citations / faculty.publications.length)
                  : 0}
              </div>
              <div className="text-slate-600">Avg Citations per Paper</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}