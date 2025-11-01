'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, TrendingUp, Award, Medal, Trophy } from 'lucide-react';

export default function Rankings() {
  const [user, setUser] = useState(null);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rankingType, setRankingType] = useState('overall');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      window.location.href = '/auth/signin';
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchRankings();
  }, [rankingType, departmentFilter]);

  const fetchRankings = async () => {
    try {
      const response = await fetch(`/api/rankings?type=${rankingType}&department=${departmentFilter}`);
      if (response.ok) {
        const data = await response.json();
        setFaculty(data);
      }
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  // NOTE: This function is not used in the component but was kept for completeness.
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const getRankIcon = rank => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-slate-600">#{rank}</span>;
  };

  const getRankBadgeColor = rank => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (rank === 2) return 'bg-gray-100 text-gray-800 border-gray-200';
    if (rank === 3) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getDepartments = () => {
    const depts = Array.from(new Set(faculty.map(f => f.department).filter(Boolean)));
    return depts;
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-slate-600">Loading rankings...</p>
        </div>
      </div>
    );
  }

  // --- Main Component Render ---
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* Assuming Navbar component is defined elsewhere */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Faculty Rankings</h1>
          <p className="text-slate-600">Recognizing excellence in research and academic contributions</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
          <div className="w-full md:w-64">
            <Select value={rankingType} onValueChange={setRankingType}>
              <SelectTrigger>
                <SelectValue placeholder="Ranking Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall">Overall Score</SelectItem>
                <SelectItem value="publications">Most Publications</SelectItem>
                <SelectItem value="citations">Most Citations</SelectItem>
                <SelectItem value="impact">Impact Factor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-64">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {getDepartments().map(dept => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Top 3 Podium */}
        {faculty.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* 2nd Place */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4">{getRankIcon(2)}</div>
              <CardHeader className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">{faculty[1]?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{faculty[1]?.name}</CardTitle>
                <CardDescription>{faculty[1]?.designation}</CardDescription>
                <Badge className={getRankBadgeColor(2)}>2nd Place</Badge>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-2">
                  {faculty[1]?.score.toFixed(1)} pts
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                  <div>{faculty[1]?.publications.length} publications</div>
                  <div>{faculty[1]?.citations} citations</div>
                </div>
              </CardContent>
            </Card>

            {/* 1st Place */}
            <Card className="relative overflow-hidden border-2 border-yellow-300 shadow-lg">
              <div className="absolute top-4 right-4">{getRankIcon(1)}</div>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-3xl bg-yellow-100 text-yellow-800">
                    {faculty[0]?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{faculty[0]?.name}</CardTitle>
                <CardDescription>{faculty[0]?.designation}</CardDescription>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  🏆 1st Place
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {faculty[0]?.score.toFixed(1)} pts
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                  <div>{faculty[0]?.publications.length} publications</div>
                  <div>{faculty[0]?.citations} citations</div>
                </div>
              </CardContent>
            </Card>

            {/* 3rd Place */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4">{getRankIcon(3)}</div>
              <CardHeader className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">{faculty[2]?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{faculty[2]?.name}</CardTitle>
                <CardDescription>{faculty[2]?.designation}</CardDescription>
                <Badge className={getRankBadgeColor(3)}>3rd Place</Badge>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-2">
                  {faculty[2]?.score.toFixed(1)} pts
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                  <div>{faculty[2]?.publications.length} publications</div>
                  <div>{faculty[2]?.citations} citations</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Complete Rankings List */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Rankings</CardTitle>
            <CardDescription>
              {rankingType === 'overall' && 'Overall academic score based on publications, citations, and impact'}
              {rankingType === 'publications' && 'Ranked by total number of publications'}
              {rankingType === 'citations' && 'Ranked by total citation count'}
              {rankingType === 'impact' && 'Ranked by average citations per publication'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {faculty.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No rankings available</h3>
                <p className="text-slate-600">Check back later for updated rankings.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {faculty.map((facultyMember, index) => (
                  <div
                    key={facultyMember.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12">
                        {index < 3 ? (
                          getRankIcon(index + 1)
                        ) : (
                          <span className="text-lg font-bold text-slate-600">#{index + 1}</span>
                        )}
                      </div>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="" />
                        <AvatarFallback>{facultyMember.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-slate-900">{facultyMember.name}</h3>
                        <p className="text-sm text-slate-600">
                          {facultyMember.designation}
                          {facultyMember.department && ` • ${facultyMember.department}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="font-bold text-lg text-slate-900">
                          {facultyMember.score.toFixed(1)} pts
                        </div>
                        <div className="text-sm text-slate-600">
                          {facultyMember.publications.length} pubs • {facultyMember.citations} cites
                        </div>
                      </div>
                      <Link href={`/faculty/${facultyMember.id}`}>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ranking Methodology */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Ranking Methodology</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Overall Score Calculation</h4>
                <p className="text-sm text-slate-600 mb-2">
                  The overall score is calculated using a weighted formula:
                </p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Publications: 40% weight</li>
                  <li>• Citations: 40% weight</li>
                  <li>• Impact Factor: 20% weight</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Impact Factor</h4>
                <p className="text-sm text-slate-600">
                  Calculated as average citations per publication, with bonuses for recent high-impact work.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}