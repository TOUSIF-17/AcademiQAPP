import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
function calculateRankingScore(faculty, type) {
  const publicationCount = faculty.publications.length;
  const totalCitations = faculty.publications.reduce((sum, pub) => sum + pub.citations, 0);
  const avgCitationsPerPub = publicationCount > 0 ? totalCitations / publicationCount : 0;
  switch (type) {
    case 'publications':
      return publicationCount * 10;
    case 'citations':
      return totalCitations;
    case 'impact':
      return avgCitationsPerPub * 10;
    case 'overall':
    default:
      // Overall score: weighted combination
      const publicationScore = publicationCount * 10;
      const citationScore = totalCitations * 0.5;
      const impactScore = avgCitationsPerPub * 8;
      return publicationScore + citationScore + impactScore;
  }
}
export async function GET(request) {
  try {
    const {
      searchParams
    } = new URL(request.url);
    const type = searchParams.get('type') || 'overall';
    const department = searchParams.get('department') || 'all';
    let faculty = await db.user.findMany({
      where: {
        role: {
          in: ['faculty', 'admin']
        }
      },
      include: {
        publications: {
          select: {
            id: true,
            title: true,
            year: true,
            citations: true,
            createdAt: true
          },
          orderBy: {
            year: 'desc'
          }
        }
      }
    });

    // Filter by department if specified
    if (department !== 'all') {
      faculty = faculty.filter(f => f.department === department);
    }

    // Calculate scores and sort
    const facultyWithScores = faculty.map(member => ({
      ...member,
      score: calculateRankingScore(member, type)
    }));

    // Sort by score (descending) and assign ranks
    facultyWithScores.sort((a, b) => b.score - a.score);
    const rankedFaculty = facultyWithScores.map((member, index) => ({
      ...member,
      rank: index + 1
    }));
    return NextResponse.json(rankedFaculty);
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, {
      status: 500
    });
  }
}
